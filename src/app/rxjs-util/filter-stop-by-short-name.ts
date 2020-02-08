import { StopShortName, IStopLocation } from '@donmahallem/trapeze-api-types';
import { OperatorFunction } from "rxjs";
import { map } from 'rxjs/operators';

type FilterOperator<T> = OperatorFunction<T[], T>

export const filterStopByShortName: <T>(cmp: (...any) => boolean) => FilterOperator<T> = <T>(cmp: (...any) => boolean): FilterOperator<T> => {
    return map((values: T[]): T => {
        const idx: number = values.findIndex(cmp);
        if (idx >= 0)
            return values[idx];
        return undefined;
    })
}