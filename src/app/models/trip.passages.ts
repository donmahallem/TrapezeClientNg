export interface TripPassageStop {
    id: string;
    shortName: string;
    name: string;
}

export interface TripPassage {
    actualTime: string;
    stop: TripPassageStop;
    stop_seq_num: number;
    status: string;
}

export interface TripPassages {
    actual: TripPassage[];
    old: TripPassage[];
    direction: string;
    directionText: string;
    routeName: string;
    tripId: string;
}
