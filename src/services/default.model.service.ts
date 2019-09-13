import { ObjectID } from "mongodb";
import { Document, Model } from "mongoose";

export class DefaultModelService<T extends Document> {
    private model: Model<T>;

    constructor(schemaModel: Model<T>) {
        this.model = schemaModel;
    }

    public async create(item: T) {
        return await this.model.create(item);
    }

    public async findOne(filter: object): Promise<T | null> {
        return await this.model.findOne(filter);
    }

    public async find(filter: object): Promise<T[] | null> {
        return await this.model.find(filter);
    }

    public async replaceById(id: ObjectID, item: T): Promise<any> {
        return await this.model.update({ id }, item);
    }

    public async delete(id: string) {
        return await this.model.remove({ id: this.toObjectId(id) });
    }

    public async findById(id: string) {
        return await this.model.findById(id);
    }

    private toObjectId(id: string): ObjectID {
        return ObjectID.createFromHexString(id);
    }
}
