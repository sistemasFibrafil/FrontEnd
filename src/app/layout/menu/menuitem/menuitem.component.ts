import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LayoutComponent } from '../../layout.component';
import { MenuService } from '../../../services/menu.service';
import { LayoutService } from '../../../services/app.layout.service';

@Component({
  selector: '[app-menuitem]',
  templateUrl: './menuitem.component.html',
  styleUrls: ['./menuitem.component.css'],
  host: {
  '[class.layout-root-menuitem]': 'root',
  '[class.active-menuitem]': 'active'},
  animations: [
    trigger('children', [
        state('collapsed', style({
            height: '0'
        })),
        state('expanded', style({
            height: '*'
        })),
        state('hidden', style({
            display: 'none'
        })),
        state('visible', style({
            display: 'block'
        })),
        transition('collapsed <=> expanded', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
    ]
})
export class MenuitemComponent implements OnInit, OnDestroy {

    @Input() item: any;

    @Input() index!: number;

    @Input() root!: boolean;

    @Input() parentKey!: string;

    active = false;

    menuSourceSubscription: Subscription;

    menuResetSubscription: Subscription;

    key: string = "";

    constructor(public layoutService: LayoutService, private cd: ChangeDetectorRef, public router: Router, private menuService: MenuService) {
        this.menuSourceSubscription = this.menuService.menuSource$.subscribe(value => {
            Promise.resolve(null).then(() => {
                if (value.routeEvent) {
                    this.active = (value.key === this.key || value.key.startsWith(this.key + '-')) ? true : false;
                }
                else {
                    if (value.key !== this.key && !value.key.startsWith(this.key + '-')) {
                        this.active = false;
                    }
                }
            });
        });

        this.menuResetSubscription = this.menuService.resetSource$.subscribe(() => {
            this.active = false;
        });

        this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(params => {
                if (this.isSlim || this.isHorizontal) {
                    this.active = false;
                }
                else {
                    if (this.item.routerLink) {
                        this.updateActiveStateFromRoute();
                    }
                }
            });
    }

    ngOnInit() {
        this.key = this.parentKey ? this.parentKey + '-' + this.index : String(this.index);

        if (!(this.isSlim || this.isHorizontal) && this.item.routerLink) {
            this.updateActiveStateFromRoute();
        }
    }

    updateActiveStateFromRoute() {
        let activeRoute = this.router.isActive(this.item.routerLink[0], { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' });

        if (activeRoute) {
            this.menuService.onMenuStateChange({key: this.key, routeEvent: true});
        }
    }

    itemClick(event: Event) {
      //debugger
        // avoid processing disabled items
        if (this.item.disabled) {
            event.preventDefault();
            return;
        }

        // navigate with hover
        if (this.root && this.isSlim || this.isHorizontal) {
            this.layoutService.state.menuHoverActive = !this.layoutService.state.menuHoverActive;
        }

        // execute command
        if (this.item.command) {
            this.item.command({ originalEvent: event, item: this.item });
        }

        // toggle active state
        if (this.item.items) {
            this.active = !this.active;

            if (this.root && this.active && (this.isSlim || this.isHorizontal)) {
                this.layoutService.onOverlaySubmenuOpen();
            }
        }
        else {
            if (this.layoutService.isMobile()) {
                this.layoutService.state.staticMenuMobileActive = false;
            }

            if (this.isSlim || this.isHorizontal) {
                this.menuService.reset();
                this.layoutService.state.menuHoverActive = false;
            }
        }

        this.menuService.onMenuStateChange({key: this.key});
    }

    onMouseEnter() {
        // activate item on hover
        if (this.root && (this.isSlim || this.isHorizontal) && this.layoutService.isDesktop()) {
            if (this.layoutService.state.menuHoverActive) {
                this.active = true;
                this.menuService.onMenuStateChange({key: this.key});
            }
        }
    }

    get submenuAnimation() {
        if (this.layoutService.isDesktop() && (this.layoutService.isHorizontal() || this.layoutService.isSlim()))
            return this.active ? 'visible' : 'hidden';
        else
            return this.root ? 'expanded' : (this.active ? 'expanded' : 'collapsed');
    }

    get isHorizontal() {
        return this.layoutService.isHorizontal();
    }

    get isSlim() {
        return this.layoutService.isSlim();
    }

    ngOnDestroy() {
        if (this.menuSourceSubscription) {
            this.menuSourceSubscription.unsubscribe();
        }

        if (this.menuResetSubscription) {
            this.menuResetSubscription.unsubscribe();
        }
    }
}
