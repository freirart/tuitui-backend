import { NextFunction, Request, Response } from "express";

const Fatura = require('../models/faturas.ts');

exports.addFatura = async (req: Request, res: Response, next: NextFunction) => {
  const { name, services, totalValue, paid } = req.body;

  try {
    if (!name || !services.length || !totalValue)
      return res.status(501).json({ error: 'Invalid data provided.' });

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
    const listaFaturas = await Fatura.find().skip(limit * pageNumber).limit(limit);

    if (!listaFaturas.length)
      return res.status(204).json({ message: 'No data found.' });
    
    return res.status(200).json({ listaFaturas });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Couldn't bring any data." });
  }
  
};