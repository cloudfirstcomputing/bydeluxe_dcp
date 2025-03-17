service PrintFormService {

    entity HDDLabels {
      key  DCPBarcode: String(40) @mandatory;
        content      : LargeBinary @Core.MediaType;
    }
    action getKrakenHDDLabel(DCPBarcode: String) returns LargeBinary;

}