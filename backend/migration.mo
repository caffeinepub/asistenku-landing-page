import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  // Types from old system
  type Role = {
    #admin;
    #adminuser;
    #adminfinance;
    #concierge;
    #asistenmu;
    #client;
    #partner;
    #guest;
  };

  type User = {
    idUser : Text;
    principalId : Text;
    nama : Text;
    email : Text;
    whatsapp : Text;
    status : Text;
    role : Role;
    sharePercentage : Nat;
  };

  type LayananStatus = {
    #aktif;
    #tidakAktif;
  };

  type Layanan = {
    id : Nat;
    name : Text;
    status : LayananStatus;
    clientId : Principal;
    hargaPerUnit : Nat;
    unitBalance : Nat;
  };

  type TaskStatus = {
    #open;
    #inProgress;
    #memintaReview;
    #selesai;
    #cancelled;
  };

  type TaskRecord = {
    id : Text;
    tipeLayanan : Text;
    judulTask : Text;
    detailTask : Text;
    deadline : Int;
    createdAt : Int;
    status : TaskStatus;
    clientId : Principal;
    partnerId : ?Principal;
    gdrive_internal : ?Text;
    gdrive_client : ?Text;
  };

  type Delegation = {
    delegationId : Nat;
    taskId : Text;
    partnerId : Principal;
    deadline : Int;
    jamEfektifPengerjaan : Nat;
    unitLayananTerpakai : Nat;
    status : Text;
    createdAt : Int;
    updatedAt : Int;
    assignedBy : Principal;
  };

  type UnitTopUp = {
    topUpId : Nat;
    clientId : Principal;
    layananId : Nat;
    unitsAdded : Nat;
    pricePerUnit : Nat;
    totalCost : Nat;
    timestamp : Int;
    approvedBy : Principal;
  };

  type FinancialProfile = {
    partnerId : Principal;
    bankName : Text;
    accountNumber : Text;
    accountHolderName : Text;
    npwp : Text;
    saldo : Nat;
  };

  type FinancialProfileUpdateRequest = {
    id : Text;
    partnerId : Principal;
    bankName : Text;
    accountNumber : Text;
    accountHolderName : Text;
    npwp : Text;
    status : Text;
    requestedAt : Int;
  };

  type OldActor = {
    users : [User];
    userIdCounter : Nat;
    layananCounter : Nat;
    nextTaskId : Nat;
    delegationCounter : Nat;
    topUpCounter : Nat;
    taskMap : Map.Map<Text, TaskRecord>;
    layananMap : Map.Map<Nat, Layanan>;
    delegationMap : Map.Map<Nat, Delegation>;
    unitTopUpMap : Map.Map<Nat, UnitTopUp>;
    financialProfiles : Map.Map<Principal, FinancialProfile>;
    financialUpdateRequests : Map.Map<Text, FinancialProfileUpdateRequest>;
  };

  public func run(old : OldActor) : OldActor {
    // Add any additional migrations or data transformations here if needed
    old;
  };
};
