using dcp.db as db from '../db/dcp';
using {API_SALES_ORDER_SRV as S4_SalesOrder} from './external/API_SALES_ORDER_SRV';

service BookingOrderService{
    entity dcpcontent as projection on db.dcpcontent;
    action createContent(Records: array of  dcpcontent) returns String;
    action processContent(dcpcontent: array of  dcpcontent) returns String;
    action reconcileContent(dcpcontent: array of  dcpcontent) returns String;

    entity dcpkey as projection on db.dcpkey;
    action createKey(Records: array of  dcpkey) returns String;
    action processKey(dcpkey: array of  dcpkey) returns String;
    action reconcileKey(dcpkey: array of  dcpkey) returns String;

    entity S4H_SOHeader as projection on S4_SalesOrder.SalesOrder;

}