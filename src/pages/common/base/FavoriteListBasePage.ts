import { BusinessPage } from './BusinessPage';
import { ActionSheet, NavController } from 'ionic-angular';
import { BusinessService } from '../../../providers/services/BusinessService';
import { ServicesPackage } from '../../../providers/services/ServicesPackage';

export class FavoriteListBasePage extends BusinessPage {
    protected dataBind: any = {};
    protected extraInfo: any = {};

    private controller: string;
    private service: BusinessService;

    private selectedItem: any;

    // action sheet 
    protected actionSheet: ActionSheet;
    protected actionSheetButtons: { text?: string; role?: string; handler?: () => boolean | void; }[];

    constructor(
        controller: string,
        protected businessService: BusinessService,
        protected services: ServicesPackage,
        protected navCtrl: NavController
    ) {
        super(services);

        this.controller = controller;
        this.service = businessService;
    }

    protected OnInitialize() {
        this.InitActionSheet();
        this.OnPreQuery();
        this.OnQery();
    }

    protected OnQery(): void {
        this.services.LoadingService.ShowWaitLoading();
        this.service.Query(this.controller, this.dataBind, this.extraInfo)
            .subscribe(response => {
                if (!response.ResponseException) {
                    // query success
                    this.OnQuerySuccess(response.Data, response.ExtraInfo);
                    // dismiss loading
                    this.services.LoadingService.Dismiss();
                    // post query
                    this.OnPostQuery();
                } else {
                    // dismiss loading
                    this.services.LoadingService.Dismiss();
                    // show alert
                    this.ProcessResponseException(response.ResponseException);
                }
            },
            error => {
                // show alert
                this.services.AlertService.ShowError("system", error);
                // dismiss loading
                this.services.LoadingService.Dismiss();
            });
    }

    protected OnQuerySuccess(data: any, extraInfo: any) {
        this.dataBind = data;
        this.extraInfo = extraInfo;
    }

    protected OnPreQuery() { }
    protected OnPostQuery() { }

    private InitActionSheet() {
        this.actionSheetButtons = this.InitActionSheetButton();
        this.actionSheet = this.services.ActionSheetService.Init(null, null, this.actionSheetButtons);
    }

    protected InitActionSheetButton(): { text?: string; role?: string; handler?: () => boolean | void; }[] {
        let buttons: { text?: string; role?: string; handler?: () => boolean | void; }[] = [];

        buttons.push({
            text: 'AddNew',
            handler: () => {
                this.navCtrl.push(this.constructor.name.replace("Favorite", "Entry"), this.selectedItem);
            }
        });

        buttons.push({
            text: 'Modify',
            handler: () => {
                this.navCtrl.push(this.constructor.name.replace("Favorite", "Entry"), this.selectedItem);
            }
        });

        buttons.push({
            text: 'Delete',
            role: 'destructive',
            handler: () => {
                this.navCtrl.push(this.constructor.name.replace("Favorite", "Entry"), this.selectedItem);
            }
        });

        buttons.push({
            text: 'Cancel',
            role: 'cancel'
        });

        return buttons;
    }

    protected onHold(item, event) {
        this.selectedItem = item;
        this.actionSheet.present();
    }
}