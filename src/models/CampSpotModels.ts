export interface ICampSpot {
    id: number;
    title: string;
    description: string[];
    hashtags: string[];
    comment: string[];
    image: {
        id: string;
    };
    comments: {
        id: number,
        user_created: string;
        description: string[];
        comment_fk: number;
        date_created: string;
};
    user_created: {
        first_name: string;
    };
}

export interface ICampSpotResponse {
    camp_spots_by_id: ICampSpot;
}

export interface ICampSpotResponse {
    camp_spots: ICampSpot[];
}

export interface INewCampSpot {
    title: string;
    description: string;
    hashtags: string[];
    image: string;
}