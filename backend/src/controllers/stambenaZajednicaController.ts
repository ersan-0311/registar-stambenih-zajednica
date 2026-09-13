import { Request, Response } from "express";
import StambenaZajednica from  "../models/StambenaZajednica"
import { group } from "node:console";
import Metapodaci from "../models/Metapodaci";

export const getAll = async (req: Request, res: Response) => {
    try {
        const { search, opstina, page = '1', limit = '20'} = req.query;  //reading query parameters

        const filter: any = {};
        if(search) filter.$text = {$search: search as string};
        if (opstina) {
            const opstine = Array.isArray(opstina) ? opstina : [opstina];
            filter.opstina = { $in: opstine };
        }

        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum-1) * limitNum;

        const [items, total] = await Promise.all([
            StambenaZajednica.find(filter).skip(skip).limit(limitNum),
            StambenaZajednica.countDocuments(filter)
        ])

        res.json({ items, total, page: pageNum, pages: Math.ceil(total/limitNum) });

    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
}


export const getById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const item = await StambenaZajednica.findById(id);

        if(!item){
            return res.status(404).json({error: "Zajednica nije pronadjena"});
        }

        res.json({item});

    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
}

export const getOpstine = async (req: Request, res: Response) => {
    try {
        const items = await StambenaZajednica.aggregate([
            {$group : { 
                _id: '$opstina', 
                brojZajednica: {$sum : 1}, 
                geografskaSirina: {$first: '$geografskaSirina'}, 
                geografskaDuzina: {$first: '$geografskaDuzina'}}},
            {$project : { _id : 0,
                opstina : '$_id', 
                brojZajednica : 1, 
                geografskaSirina : 1, 
                geografskaDuzina : 1}}
        ])


        res.json({items});


    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
}

export const getStatistika = async (req: Request, res: Response) => {
  try {
    const [ukupnoZajednica, ukupnoOpstina, metapodaci] = await Promise.all([
      StambenaZajednica.countDocuments({}),
      StambenaZajednica.distinct('opstina'),
      Metapodaci.findOne({})
    ]);

    res.json({
      ukupnoZajednica,
      ukupnoOpstina: ukupnoOpstina.length,
      datumUvoza: metapodaci ? metapodaci.datumUvoza : null
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};