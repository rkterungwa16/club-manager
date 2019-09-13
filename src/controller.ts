import { Request, Response } from "express";
import { Inject } from "typescript-ioc";
import { IRequest } from "./types";

export class ClubManagerController {
    // @Inject
    // private invertedIndexService!: InvertedIndexService;

    public login = async (req: IRequest, res: Response) => {
        try {
            // const { path, mimetype } = req.file;
            // const { booksCollectionName } = req.body;
            // return res.status(201).send({
            //     message: "index successfully created",
            //     data: await this.invertedIndexService.createIndex(path, mimetype, booksCollectionName),
            // });
        } catch (error) {
            // return next(error);
            return res.status(400).send({
                message: "bad request",
                error
            });
        }
    };

    public createClub = async (req: Request, res: Response) => {
        try {
            // const { booksCollectionName, searchTerm } = req.body;
            // const searchResult = await this.invertedIndexService.search(searchTerm, booksCollectionName);
            // return res.status(200).send({
            //     message: "Successful search result",
            //     searchResult,
            // });
        } catch (err) {
            return res.status(400).send({
                message: "bad request",
                err
            });
        }
    };
}
