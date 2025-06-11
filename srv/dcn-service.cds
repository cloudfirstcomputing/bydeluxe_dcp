using {dcn.db as db} from '../db/dcn';

service DcnStatusService {

    entity StatusStaging    as projection on db.StatusStaging;
    entity StatusConversion as projection on db.StatusConversion;
    annotate StatusConversion with @odata.draft.enabled;


}
