export type RotatingMarker = L.Marker & {
    setRotationAngle(angle: number): void;
};

export type RotatingMarkerOptions = L.MarkerOptions & {
    rotationAngle: number;
};
/*
((): void => {
    // save these original methods before they are overwritten
    const protoInitIcon: any = (Marker.prototype as any)._initIcon;
    const protoSetPos: (pos: any) => any = (Marker.prototype as any)._setPos;

    const oldIE: boolean = (DomUtil.TRANSFORM === 'msTransform');

    // tslint:disable-next-line:space-before-function-paren
    Marker.addInitHook(function (): void {
        const iconOptions: any = this.options.icon && this.options.icon.options;
        let iconAnchor: any = iconOptions && this.options.icon.options.iconAnchor;
        if (iconAnchor) {
            iconAnchor = (iconAnchor[0] + 'px ' + iconAnchor[1] + 'px');
        }
        this.options.rotationOrigin = this.options.rotationOrigin || iconAnchor || 'center bottom';
        this.options.rotationAngle = this.options.rotationAngle || 0;

        // Ensure marker keeps rotated during dragging
        this.on('drag', (e: L.LeafletEvent) => { e.target._applyRotation(); });
    });

    Marker.include({

        _applyRotation(): void {
            if (this.options.rotationAngle) {
                this._icon.style[DomUtil.TRANSFORM + 'Origin'] = this.options.rotationOrigin;

                if (oldIE) {
                    // for IE 9, use the 2D rotation
                    this._icon.style[DomUtil.TRANSFORM] = 'rotate(' + this.options.rotationAngle + 'deg)';
                } else {
                    // for modern browsers, prefer the 3D accelerated version
                    this._icon.style[DomUtil.TRANSFORM] += ' rotateZ(' + this.options.rotationAngle + 'deg)';
                }
            }
        },

        _initIcon(): void {
            protoInitIcon.call(this);
        },

        _key: undefined,

        _setPos(pos: any): void {
            protoSetPos.call(this, pos);
            this._applyRotation();
        },

        getKey(): any {
            return this._key;
        },
        setKey(key: any): void {
            this._key = key;
        },
        setRotationAngle(angle: number): void {
            this.options.rotationAngle = angle;
            this.update();
            return this;
        },

        setRotationOrigin(origin: any): void {
            this.options.rotationOrigin = origin;
            this.update();
            return this;
        },
    });
})();
*/
