import Book from "../../domain/Book";

export default class BookCache {

    private books: Map<string, any>;

    constructor() {
        this.books = new Map();
    }

    public getOrCreate(marketId: string): any {
        if (!this.books.has(marketId)) {
            this.books.set(marketId, new Book(marketId));
        }
        return this.books.get(marketId);
    }

}