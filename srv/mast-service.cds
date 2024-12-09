using deluxe.mastering as db from '../db/mastering';

service MasteringService @(requires: 'authenticated-user') {
    entity SalesOrders     as projection on db.SalesOrders;
    entity ImageEssence    as projection on db.ImageEssence;
    entity AudioEssence    as projection on db.AudioEssence;
    entity AUXEssence      as projection on db.AUXEssence;
    entity SubtitleEssence as projection on db.SubtitleEssence;
    entity OCAPEssence     as projection on db.OCAPEssence;
    entity CCAPEssence     as projection on db.CCAPEssence;
    entity HeadTailReels   as projection on db.HeadTailReels;
    entity Edits           as projection on db.Edits;
    entity Inserts         as projection on db.Inserts;
}
