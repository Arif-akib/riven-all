export interface Promotion {
    _id: string,
    name: string
}

export interface HeroBanner {
    _id: string,
    title: string,
    subTitle: string,
    image: string,
    buttonText: string,
    buttonLink: string
}

export interface Category {
    id: string,
    name: string,
    slug: string,
    image: string,
    color: string,
    productCount:number
}

export interface Brand {
    id: string,
    name: string,
    slug: string,
    image: string
}

export interface Offer {
    _id: string,
    title: string,
    subtitle: string,
    image: string
}

export interface Review {
    _id: string,
    name: string,
    comment: string,
    rating: string
}