const crypto = require('crypto')
const { hash } = require('bcryptjs')

const User = require('../models/User')
const mailer = require('../../lib/mailer')

module.exports = {
  registerForm(req, res) {
    return res.render('admin/users/register')
  },
  async editForm(req, res) {
    try {
      const user = await User.findOne({ where: { id: req.params.id } })
      user.is_admin = user.is_admin.toString()

      if(req.session.success) {
        res.render('admin/users/edit', {
          user,
          success: req.session.success
        })
        req.session.success = ''
      }

      res.render('admin/users/edit', { user })
    } catch (error) {
      console.error(error)
      return res.render('admin/users/edit', {
        user: req.body,
        error: 'Alguma coisa deu errado! Tente novamente.'
      })
    }
  },
  async list(req, res) {
    const users = await User.findAll()

    if(req.session.success) {
      res.render('admin/users/list', {
        users,
        success: req.session.success
      })
    }

    return res.render('admin/users/list', { users })
  },
  async post(req, res) {
    try {
      const userPassword = crypto.randomBytes(4).toString('hex')

      await mailer.sendMail({
        to: req.body.email,
        from: 'no-reply@foodfy.com.br',
        subject: 'Bem-vindo(a) ao Foodfy',
        html: `
        <div
          style="
            font-family: sans-serif;
            font-weight: 300;
            color: #383838;
          "
        >
          <h3 style="color: #6558C3;">
            Seja bem vindo(a) ao Foodfy ${req.body.name},
          </h3>
          <p>Seu cadastro foi realizado com sucesso!</p>

          <br />

          <p>Essas são suas credenciais para acessar a area administrativa:</p>
          <p>Login: ${req.body.email}</p>
          <p>Senha: ${userPassword}</p>

          <br />

          <p>Para acessar sua conta basta clicar no botão abaixo</p>

          <br />
          
          <a
            style="
            display: inline-block;
            margin-bottom: 16px;
            padding: 15px 20px;
            text-decoration: none;
            border-radius: 4px;
            color: #FFFFFF;
            background-color: #6558C3;
            cursor: pointer;
            "
            href="http://localhost:3000/session/login"
          >
            Acessar
          </a>

          <p
            style="
              padding-top:16px;
              border-top: 1px solid #989898;
            "
          >
            Equipe Foodfy.
          </p>
        </div>
      `
      });

      const password = await hash(userPassword, 8)

      const data = {
        ...req.body,
        password
      };

      await User.create(data);
      
      return res.render(`admin/users/register`, {
        success: 'Usuário cadastrado com sucesso!'
      });
    } catch (error) {
      console.error(error)
      return res.render('admin/users/register', {
        user: req.body,
        error: 'Alguma coisa deu errado! Tente novamente.'
      })
    }
  },
  async put(req, res) {
    try {
      let { id, name, email, is_admin } = req.body
      is_admin = is_admin || false

      await User.update(id, {
        name,
        email,
        is_admin
      })

      return res.render('admin/users/edit', { 
        user: req.body,
        success: 'Usuário alterado com sucesso!'
      })
    } catch(error) {
      console.error(error)
      return res.render('admin/user/edit', {
        user: req.body,
        error: 'Alguma coisa deu errado! Tente novamente.'
      })
    }
  },
  async delete(req, res) {
    try {
      await User.delete(req.body.id)

      req.session.success = 'Usuário exluído com sucesso!'

      return res.redirect('/admin/users')
    } catch(error) {
      console.error(error)
      res.render('user/edit', {
        user: req.body,
        error: 'Alguma coisa deu errado! Tente novamente.'
      })
    }
  }
}