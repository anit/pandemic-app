export class AppLocation {
    public latitude: string;
    public longitude: string;
    public postalCode: string;
    public state: string;
    public district: string;
    public city: string;

    constructor () {}
}

export const FallbackLocation: AppLocation = { 
    latitude: '28.6151947',
    longitude: '77.2059342',
    postalCode: '110004',
    state: 'Delhi',
    city: 'Delhi',
    district: 'New Delhi'
}  