using {dcn.db as db} from '../db/dcn';
using {dcp.db as dcp} from '../db/dcp';


service DcnStatusService {

    entity StatusStaging    as projection on db.StatusStaging;
    entity StatusConversion as projection on db.StatusConversion;
    annotate StatusConversion with @odata.draft.enabled;
    entity StatusWebHooks   as projection on db.StatusWebHooks;
    entity InterfaceStatus  as projection on db.InterfaceStatus;
    action fillStatusStaging() returns Boolean;

    @readonly
    entity StudioFeed       as projection on dcp.StudioFeed;


}
