import { NextFunction, Request, Response } from "express";
const mongoose = require("mongoose");

const Fatura = require("../models/faturas");

const isThereAnyBodyParamUndefined = require("../utils");

interface Servico {
  name: string;
  value: number;
}

const areServicesInvalid = (services: Array<Servico>) => {
  // !! -> getting the boolean result of it (true: found invalid service)
  return !!services.find((service: Servico) => {
    // characteristics that defines a invalid service
    return (
      !service.name ||
      !service.value ||
      typeof service.name !== "string" ||
      typeof service.value !== "number" ||
      Object.keys(service).length > 2
    );
  });
};

const actions: ObjectLiteral = {
  GET: (id: string, userId: string): Promise<object> => {
    return Fatura.findOne({ _id: id, user: userId }).populate("User").exec();
  },
  DELETE: (id: string, userId: string): Promise<object> => {
    return Fatura.findOneAndDelete({ _id: id, user: userId }).exec();
  },
  PUT: (id: string, userId: string, newValues: object): Promise<object> => {
    return Fatura.findOneAndUpdate({ _id: id, user: userId }, newValues, {
      new: true,
    }).exec();
  },
};

exports.addFatura = async (req: Request, res: Response) => {
  const { name, paid } = req.body;
  let { validade } = req.body;
  const services = (req.body.services as Array<Servico>) || [];

  try {
    const bodyParams = {
      "fatura's name": name,
      services: services.length,
      validade: validade,
    };
    const result = isThereAnyBodyParamUndefined(bodyParams);
    if (result.yes)
      return res.status(400).json({
        error: `No ${result.whichOne} provided.`,
        documentation:
          "https://github.com/freirart/desafio-tecnico-music-playce/blob/main/public/docs.md",
      });

    if (areServicesInvalid(services)) {
      return res.status(400).json({
        error: "Services' objects MUST follow the pattern: { 'name': <string>, 'value': <number> }.",
        documentation:
          "https://github.com/freirart/desafio-tecnico-music-playce/blob/main/public/docs.md",
      });
    }

    const [year, month, day] = validade.split("T")[0].split(/[\/\-]/);
    if (!year || !month || !day) {
      return res.status(400).json({
        error: "Validade MUST follow the pattern: 'yyyy/mm/dd'.",
        documentation:
          "https://github.com/freirart/desafio-tecnico-music-playce/blob/main/public/docs.md",
      });
    }
    validade = new Date(year, month - 1, day);

    const totalValue = services.reduce(
      (acc: number, service: Servico): number => {
        return acc + service.value;
      },
      0
    );

    const fatura = await Fatura.create({
      name,
      services,
      totalValue,
      paid,
      user: req.userId,
      validade,
    });

    res.status(201).json({ fatura });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error creating fatura." });
  }
};

exports.fetchByPageNumber = async (
  req: Request,
  res: Response
) => {
  const pageNumber = Number(req.params.pageNumber) || 0;
  const limit = Number(process.env.PAGINATION_LIMIT) || 20;

  try {
    const listaFaturas = await Fatura.find({ user: req.userId })
      .skip(limit * pageNumber)
      .limit(limit)
      .exec();

    if (!listaFaturas.length)
      return res.status(204).json({ message: "No data found." });

    res.status(200).json({ listaFaturas });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Couldn't bring any data." });
  }
};

exports.performById = async (
  req: Request,
  res: Response
) => {
  const { faturaId } = req.params;
  const method = req.method.toUpperCase();

  try {
    if (!mongoose.Types.ObjectId.isValid(faturaId))
      return res.status(400).json({
        error: "Invalid id.",
        documentation:
          "https://github.com/freirart/desafio-tecnico-music-playce/blob/main/public/docs.md",
      });

    let fatura = await actions["GET"](faturaId, req.userId);

    if (!fatura?._id)
      return res.status(400).json({
        error: "No faturas was found with this id.",
        documentation:
          "https://github.com/freirart/desafio-tecnico-music-playce/blob/main/public/docs.md",
      });

    fatura = await actions[method](faturaId, req.userId);

    res.status(200).json({
      method: method !== "GET" ? method : undefined,
      fatura: method === "GET" ? fatura : undefined,
      status: method !== "GET" ? "Success!" : undefined,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({
        error:
          method === "GET"
            ? "Couldn't bring any data."
            : "Couldn't delete fatura.",
      });
  }
};

exports.updateFatura = async (
  req: Request,
  res: Response
) => {
  const { paid, name, _id } = req.body;
  let { validade } = req.body;
  const services = (req.body.services as Array<Servico>) || [];
  const method = req.method.toUpperCase();

  try {
    const bodyParams = {
      "faturas's id": _id,
      "fatura's name": name,
      services: services.length,
      validade: validade,
    };
    const result = isThereAnyBodyParamUndefined(bodyParams);
    if (result.yes)
      return res.status(400).json({
        error: `No ${result.whichOne} provided.`,
        documentation:
          "https://github.com/freirart/desafio-tecnico-music-playce/blob/main/public/docs.md",
      });

    if (areServicesInvalid(services)) {
      return res.status(400).json({
        error: "Services' objects MUST follow the pattern: { 'name': <string>, 'value': <number> }.",
        documentation:
          "https://github.com/freirart/desafio-tecnico-music-playce/blob/main/public/docs.md",
      });
    }

    const [year, month, day] = validade.split("T")[0].split(/[\/\-]/);
    if (!year || !month || !day) {
      return res.status(400).json({
        error: "Validade MUST follow the pattern: 'yyyy/mm/dd'.",
        documentation:
          "https://github.com/freirart/desafio-tecnico-music-playce/blob/main/public/docs.md",
      });
    }
    validade = new Date(year, month - 1, day);

    const totalValue = services.reduce(
      (acc: number, service: Servico): number => {
        return acc + service.value;
      },
      0
    );

    const updatedFatura = await actions[method](_id, req.userId, {
      services,
      paid,
      name,
      totalValue,
      validade,
    });

    res.status(200).json({ updatedFatura });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ error: "Couldn't update fatura." });
  }
};
