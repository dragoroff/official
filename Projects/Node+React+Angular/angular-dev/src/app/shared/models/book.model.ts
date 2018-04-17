
export interface BookRootObject {
    items: Book[];
}

export interface Book {
    _id?: string;
    __v?:string
    volumeInfo: VolumeInfo;
    saleInfo?: SaleInfo;
}

export interface SaleInfo {
    listPrice?: ListPrice;
}

export interface ListPrice {
    amount?: number;
    currencyCode?: string;
}

export interface VolumeInfo {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    imageLinks: ImageLinks;
    language?: string;
    subtitle?: string;
}

export interface ImageLinks {
    smallThumbnail?: string;
    thumbnail?: string;
}





