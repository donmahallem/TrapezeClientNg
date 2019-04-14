import * as L from 'leaflet';
import { STOP_ICON_SHADOW_URL, STOP_ICON_URL } from './constants';
export const createStopIcon: (iconSize?: number) => L.Icon = (iconSize: number = 24): L.Icon => {
    return L.icon({
        iconAnchor: [iconSize / 2, iconSize / 2], // point of the icon which will correspond to marker's location
        // shadowUrl: 'leaf-shadow.png',
        iconSize: [iconSize, iconSize], // size of the icon
        iconUrl: STOP_ICON_URL,
        popupAnchor: [iconSize / 2, iconSize / 2], // point from which the popup should open relative to the iconAnchor
        shadowAnchor: [iconSize / 7 * 3, iconSize / 7 * 3],  // the same for the shadow
        shadowSize: [iconSize * 1.1, iconSize * 1.1], // size of the shadow
        shadowUrl: STOP_ICON_SHADOW_URL,
    });
};
