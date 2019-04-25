'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">@donmahallem/trapeze-client-ng documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="dependencies.html" data-type="chapter-link">
                                <span class="icon ion-ios-list"></span>Dependencies
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse" ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-14c75fc3b71afd83fa7d05843ecdba33"' : 'data-target="#xs-components-links-module-AppModule-14c75fc3b71afd83fa7d05843ecdba33"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-14c75fc3b71afd83fa7d05843ecdba33"' :
                                            'id="xs-components-links-module-AppModule-14c75fc3b71afd83fa7d05843ecdba33"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-AppModule-14c75fc3b71afd83fa7d05843ecdba33"' : 'data-target="#xs-directives-links-module-AppModule-14c75fc3b71afd83fa7d05843ecdba33"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-AppModule-14c75fc3b71afd83fa7d05843ecdba33"' :
                                        'id="xs-directives-links-module-AppModule-14c75fc3b71afd83fa7d05843ecdba33"' }>
                                        <li class="link">
                                            <a href="directives/DrawableDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">DrawableDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-14c75fc3b71afd83fa7d05843ecdba33"' : 'data-target="#xs-injectables-links-module-AppModule-14c75fc3b71afd83fa7d05843ecdba33"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-14c75fc3b71afd83fa7d05843ecdba33"' :
                                        'id="xs-injectables-links-module-AppModule-14c75fc3b71afd83fa7d05843ecdba33"' }>
                                        <li class="link">
                                            <a href="injectables/SettingsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SettingsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StopPointService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>StopPointService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserLocationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UserLocationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CountdownTimerModule.html" data-type="entity-link">CountdownTimerModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-CountdownTimerModule-dfaacf534f1573a8b4eb33ad2d632a5c"' : 'data-target="#xs-directives-links-module-CountdownTimerModule-dfaacf534f1573a8b4eb33ad2d632a5c"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-CountdownTimerModule-dfaacf534f1573a8b4eb33ad2d632a5c"' :
                                        'id="xs-directives-links-module-CountdownTimerModule-dfaacf534f1573a8b4eb33ad2d632a5c"' }>
                                        <li class="link">
                                            <a href="directives/CountdownTimerDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">CountdownTimerDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MainMapModule.html" data-type="entity-link">MainMapModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-MainMapModule-ea7c3935b09753d7d9e04ef4170876be"' : 'data-target="#xs-directives-links-module-MainMapModule-ea7c3935b09753d7d9e04ef4170876be"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-MainMapModule-ea7c3935b09753d7d9e04ef4170876be"' :
                                        'id="xs-directives-links-module-MainMapModule-ea7c3935b09753d7d9e04ef4170876be"' }>
                                        <li class="link">
                                            <a href="directives/MainMapDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">MainMapDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MainToolbarModule.html" data-type="entity-link">MainToolbarModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MainToolbarModule-f7c383a3e1e66afa9813ad74a86638d5"' : 'data-target="#xs-components-links-module-MainToolbarModule-f7c383a3e1e66afa9813ad74a86638d5"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MainToolbarModule-f7c383a3e1e66afa9813ad74a86638d5"' :
                                            'id="xs-components-links-module-MainToolbarModule-f7c383a3e1e66afa9813ad74a86638d5"' }>
                                            <li class="link">
                                                <a href="components/MainToolbarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MainToolbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RouteLoadingIndicatorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RouteLoadingIndicatorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ToolbarSearchBoxComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ToolbarSearchBoxComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MapHeaderBoxModule.html" data-type="entity-link">MapHeaderBoxModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MapHeaderBoxModule-89651ce21ace0ebd2bbee78fa8017730"' : 'data-target="#xs-components-links-module-MapHeaderBoxModule-89651ce21ace0ebd2bbee78fa8017730"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MapHeaderBoxModule-89651ce21ace0ebd2bbee78fa8017730"' :
                                            'id="xs-components-links-module-MapHeaderBoxModule-89651ce21ace0ebd2bbee78fa8017730"' }>
                                            <li class="link">
                                                <a href="components/MapHeaderBoxComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MapHeaderBoxComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/NotFoundModule.html" data-type="entity-link">NotFoundModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-NotFoundModule-7a10343a8d42363679198726109cfe1c"' : 'data-target="#xs-components-links-module-NotFoundModule-7a10343a8d42363679198726109cfe1c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-NotFoundModule-7a10343a8d42363679198726109cfe1c"' :
                                            'id="xs-components-links-module-NotFoundModule-7a10343a8d42363679198726109cfe1c"' }>
                                            <li class="link">
                                                <a href="components/NotFoundComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NotFoundComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/NotFoundRoutingModule.html" data-type="entity-link">NotFoundRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SidebarModule.html" data-type="entity-link">SidebarModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SidebarModule-057b7e904dceda8c43b828c71b14275b"' : 'data-target="#xs-components-links-module-SidebarModule-057b7e904dceda8c43b828c71b14275b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SidebarModule-057b7e904dceda8c43b828c71b14275b"' :
                                            'id="xs-components-links-module-SidebarModule-057b7e904dceda8c43b828c71b14275b"' }>
                                            <li class="link">
                                                <a href="components/SidebarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SidebarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StopModule.html" data-type="entity-link">StopModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StopModule-2d3c3a273f0925102549d32e4ce46823"' : 'data-target="#xs-components-links-module-StopModule-2d3c3a273f0925102549d32e4ce46823"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StopModule-2d3c3a273f0925102549d32e4ce46823"' :
                                            'id="xs-components-links-module-StopModule-2d3c3a273f0925102549d32e4ce46823"' }>
                                            <li class="link">
                                                <a href="components/DepartureListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DepartureListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DepartureListItemComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DepartureListItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RouteListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RouteListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StopInfoComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StopInfoComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-StopModule-2d3c3a273f0925102549d32e4ce46823"' : 'data-target="#xs-directives-links-module-StopModule-2d3c3a273f0925102549d32e4ce46823"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-StopModule-2d3c3a273f0925102549d32e4ce46823"' :
                                        'id="xs-directives-links-module-StopModule-2d3c3a273f0925102549d32e4ce46823"' }>
                                        <li class="link">
                                            <a href="directives/StopLocationMapDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">StopLocationMapDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StopRoutingModule.html" data-type="entity-link">StopRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StopsModule.html" data-type="entity-link">StopsModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StopsRoutingModule.html" data-type="entity-link">StopsRoutingModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StopsRoutingModule-3addb2fcbfb78a570f1ba3cec906543c"' : 'data-target="#xs-components-links-module-StopsRoutingModule-3addb2fcbfb78a570f1ba3cec906543c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StopsRoutingModule-3addb2fcbfb78a570f1ba3cec906543c"' :
                                            'id="xs-components-links-module-StopsRoutingModule-3addb2fcbfb78a570f1ba3cec906543c"' }>
                                            <li class="link">
                                                <a href="components/StopsInfoComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StopsInfoComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TripPassagesModule.html" data-type="entity-link">TripPassagesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TripPassagesModule-08597e061912e9aeee1f44875e86be56"' : 'data-target="#xs-components-links-module-TripPassagesModule-08597e061912e9aeee1f44875e86be56"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TripPassagesModule-08597e061912e9aeee1f44875e86be56"' :
                                            'id="xs-components-links-module-TripPassagesModule-08597e061912e9aeee1f44875e86be56"' }>
                                            <li class="link">
                                                <a href="components/TripPassagesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TripPassagesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-TripPassagesModule-08597e061912e9aeee1f44875e86be56"' : 'data-target="#xs-directives-links-module-TripPassagesModule-08597e061912e9aeee1f44875e86be56"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-TripPassagesModule-08597e061912e9aeee1f44875e86be56"' :
                                        'id="xs-directives-links-module-TripPassagesModule-08597e061912e9aeee1f44875e86be56"' }>
                                        <li class="link">
                                            <a href="directives/FollowBusMapDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">FollowBusMapDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TripPassagesRoutingModule.html" data-type="entity-link">TripPassagesRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AppPreloadingStrategy.html" data-type="entity-link">AppPreloadingStrategy</a>
                            </li>
                            <li class="link">
                                <a href="classes/LeafletMapComponent.html" data-type="entity-link">LeafletMapComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/NavigationSubscriber.html" data-type="entity-link">NavigationSubscriber</a>
                            </li>
                            <li class="link">
                                <a href="classes/RouteLoadingSubscriber.html" data-type="entity-link">RouteLoadingSubscriber</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoutesSubscriber.html" data-type="entity-link">RoutesSubscriber</a>
                            </li>
                            <li class="link">
                                <a href="classes/SettingsLoadSubscriber.html" data-type="entity-link">SettingsLoadSubscriber</a>
                            </li>
                            <li class="link">
                                <a href="classes/StopPointLoadSubscriber.html" data-type="entity-link">StopPointLoadSubscriber</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserLocationSubscriber.html" data-type="entity-link">UserLocationSubscriber</a>
                            </li>
                            <li class="link">
                                <a href="classes/VehicleLoadSubscriber.html" data-type="entity-link">VehicleLoadSubscriber</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ApiService.html" data-type="entity-link">ApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SidebarService.html" data-type="entity-link">SidebarService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/StopInfoResolver.html" data-type="entity-link">StopInfoResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/StopsResolver.html" data-type="entity-link">StopsResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/TripPassagesResolver.html" data-type="entity-link">TripPassagesResolver</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Bounds.html" data-type="entity-link">Bounds</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEnvironmentBase.html" data-type="entity-link">IEnvironmentBase</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMapBounds.html" data-type="entity-link">IMapBounds</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMapMoveEndEvent.html" data-type="entity-link">IMapMoveEndEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMapMoveStartEvent.html" data-type="entity-link">IMapMoveStartEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPassageStatus.html" data-type="entity-link">IPassageStatus</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});