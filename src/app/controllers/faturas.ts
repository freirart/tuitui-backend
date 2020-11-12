import { NextFunction, Request, Response } from "express";

const Fatura = require('../models/faturas.ts');

interface Servico {
  name: string;
  value: number;
};

interface ObjectLiteral {
  [key: string]: Function;
};

const actions: ObjectLiteral = {
  "GET": (id: string, userId: string): Promise<object> => {
    return Fatura.findOne({ _id: id, user: userId }).exec();
  },
  "DELETE": (id: string, userId: string): Promise<object> => {
    return Fatura.findOneAndDelete({ _id: id, user: userId }).exec();
  },
  "PUT": (id: string, userId: string, newValues: Object): Promise<object> => {
    return Fatura.findOneAndUpdate(
        { _id: id, user: userId }, newValues, { new: true }
    ).exec();
  }
};

exports.addFatura = async (req: Request, res: Response, next: NextFunction) => {
  const { name, services, paid } = req.body;
  let { totalValue } = req.body;

  try {
    if (!name || !services.length || !totalValue)
      return res.status(501).json({ error: 'Invalid data provided.' });

    const trueServicesValue = services.reduce((acc: number, service: Servico) => {
      return acc + service.value;
    }, 0);

    if (trueServicesValue !== totalValue) 
      totalValue = trueServicesValue;

    const fatura = await Fatura.create({
       name, services, totalValue, paid, user: req.userId
    });
  
    res.status(201).json({ fatura });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: 'Error creating fatura.' })
  }
};

exports.fetchByPageNumber = async (req: Request, res: Response, next: NextFunction) => {
  const pageNumber = Number(req.params.pageNumber) || 0;
  const limit = Number(process.env.PAGINATION_LIMIT) || 20;

  try {
    const listaFaturas = await Fatura.find({ user: req.userId })
                                .skip(limit * pageNumber)
                                .limit(limit)
                                .exec();

    if (!listaFaturas.length)
      return res.status(204).json({ message: 'No data found.' });
    
    return res.status(200).json({ listaFaturas });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Couldn't bring any data." });
  }
  
};

exports.performById = async (req: Request, res: Response, next: NextFunction) => {
  const { faturaId } = req.params;
  const method = req.method.toUpperCase();

  try {
    if (!faturaId)
      return res.status(400).json({ error: 'Invalid id / no id provided.' });

    const fatura = await actions[method](faturaId, req.userId);

    if (!fatura?.name)
      return res.status(204).json({ error: 'No faturas found.' })

    res.status(200).json({ method, fatura, status: 'Success!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 
      method === 'GET' 
      ? "Couldn't bring any data."
      : "Couldn't delete fatura."
    });
  }
};

exports.updateFatura = async (req: Request, res: Response, next: NextFunction) => {
  const { services, paid, name, _id } = req.body;
  let { totalValue } = req.body;
  const method = req.method.toUpperCase();

  try {
    if (!_id || !services || !name || !totalValue) {
      return res.status(501).json({
         error: "Couldn't update fatura: missing required values." 
      });
    }

    const trueServicesValue = services.reduce((acc: number, service: Servico) => {
      return acc + service.value;
    }, 0);

    if (trueServicesValue !== totalValue) 
      totalValue = trueServicesValue;

    const fatura = await actions[method](_id, req.userId, {
      services, paid, name, totalValue
    });

    res.status(200).json({ message: 'Success updating fatura!', fatura });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ error: "Couldn't update fatura." });
  }
};