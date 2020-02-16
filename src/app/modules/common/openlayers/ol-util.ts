import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { FeatureLike } from 'ol/Feature';

const DEFAULT_STYLES: { [key: string]: Style; } = {
    route: new Style({
        stroke: new Stroke({
            width: 6, color: [237, 212, 0, 0.8],
        }),
    }),
    icon: new Style({
        image: new Icon({
            anchor: [0.5, 0.5],
            // size: [32, 32],
            src: 'assets/stop-icon-24.svg',
            imgSize: [64, 64],
            scale: 0.5,
        }),
    }),
    geoMarker: new Style({
        image: new CircleStyle({
            radius: 7,
            fill: new Fill({ color: 'black' }),
            stroke: new Stroke({
                color: 'white', width: 2,
            }),
        }),
    }),
};
export class OlUtil {
    public static createStyles(feature: FeatureLike): Style | Style[] {
        // hide geoMarker if animation is active
        if (feature.get('type') === 'geoMarker') {
            return undefined;
        }
        return DEFAULT_STYLES[feature.get('type')];
    }
}
