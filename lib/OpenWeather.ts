// deno-lint-ignore-file no-explicit-any
import { projectObject } from "./utils.ts";

type Modify<T, R> = Partial<Record<keyof T, R>>;

type Projection<T> = Modify<T, 1 | 0>;

type OneCallProjection = Projection<Omit<OneCallResponse, "timezone" | "timezone_offset" | "alerts">>;

class OneCallError extends Error {
    private cod: number;
    constructor(msg: string, cod: number) {
        super(msg);
        this.cod = cod;

        Object.setPrototypeOf(this, OneCallError.prototype);
    }
}

interface Location {
    lat: number;
    lng: number;
}

interface OneCallResponse {
    timezone: string;
    timezone_offset: number;
    current?: Current;
    minutely?: any;
    hourly?: any;
    daily?: any;
    alerts: any;
}

interface Current {
    dt: string;
    sunrise: string;
    sunset: string;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: string;
    wind_speed: number;
    wind_deg: number;
    wind_gust?: number;
    weather: {
        id: string;
        main: string;
        description: string;
        icon: string;
    };
}

class OpenWeather {
    private readonly APPID: string;
    readonly URL: string = "https://api.openweathermap.org/data/2.5";
    readonly UNITS: string = "metric";
    
    constructor(OPW_APP_ID: string){
        this.APPID = OPW_APP_ID;
    }

    async oneCall(location: Location, projection?: OneCallProjection): Promise<OneCallResponse|undefined>{
        const response = await fetch(`${this.URL}/onecall?lat=${location.lat}&lon=${location.lng}&units=${this.UNITS}&appid=${this.APPID}`);
        const { cod, msg, _lat, _lng, timezone, timezone_offset, ...data } = await response.json();

        if(cod && msg) throw new OneCallError(msg, cod);

        if(!projection) return data;

        return { ...projectObject(data, projection), timezone, timezone_offset };
    }

}

export { OpenWeather };
export type { OneCallResponse, OneCallError, OneCallProjection, Current, Modify, Projection };
