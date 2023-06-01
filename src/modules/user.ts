import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export = {
  async createUser(req: Request, res: Response) {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res
        .status(400)
        .json({ error: "Envie todos os dados solicitados!" });

    const emailExists = await prisma.tb_user.findFirst({
      where: { email: email },
    });

    if (emailExists)
      return res.status(400).json({ error: "Este email já está cadastrado!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const resp = await prisma.tb_user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: false
      }
    });

    res.status(200).json(resp);
  },

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email } = req.body;

    const userExists = await prisma.tb_user.findUnique({
      where: { id: id },
    });

    if (!userExists)
      return res.status(400).json({ error: "Usuário não encontrado!" });

    const resp = await prisma.tb_user.update({
      where: { id: userExists.id },
      data: {
        name,
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: false,
      },
    });

    res.status(200).json(resp);
  },

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    const userExists = await prisma.tb_user.findUnique({
      where: { id: id },
    });

    if (!userExists)
      return res.status(400).json({ error: "Este usuário não existe!" });

    const response = await prisma.tb_user.update({
      where: { id: userExists?.id },
      data: {
        deleted_at: new Date(),
      },
    });

    res.status(200).send({ success: "Usuário excluído com sucesso!" });
  },

  async getMe(req: any, res: any) {
    const { userData } = req;

    const userExists = await prisma.tb_user.findUnique({
      where: { id: userData?.id }
    })

    if(!userExists) return res.status(400).json({ error: "Usuário não encontrado!" })

    const resp = await prisma.tb_user.findFirst({
      where: { id: userExists?.id },
      select: {
        id: true,
        name: true,
        email: true,
        password: false,
      },
    });

    res.status(200).json(resp);
  },
};
