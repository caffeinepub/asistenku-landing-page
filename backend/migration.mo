import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
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
  };

  type TaskStatus = {
    #belum;
    #proses;
    #selesai;
  };

  type LayananStatus = {
    #aktif;
    #tidakAktif;
  };

  type OldTask = {
    id : Nat;
    name : Text;
    status : TaskStatus;
    layananId : ?Nat;
  };

  type NewTask = {
    id : Text;
    tipeLayanan : Text;
    judulTask : Text;
    detailTask : Text;
    deadline : Int;
    createdAt : Int;
  };

  type Layanan = {
    id : Nat;
    name : Text;
    status : LayananStatus;
    clientId : Principal;
  };

  type OldActor = {
    users : [User];
    userIdCounter : Nat;
    taskCounter : Nat;
    layananCounter : Nat;
    tasks : Map.Map<Nat, OldTask>;
    layananMap : Map.Map<Nat, Layanan>;
    tasksEntries : [(Nat, OldTask)];
    layananEntries : [(Nat, Layanan)];
  };

  type NewActor = {
    users : [User];
    userIdCounter : Nat;
    layananCounter : Nat;
    layananMap : Map.Map<Nat, Layanan>;
    taskCounter : Nat;
    nextTaskId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      users = old.users;
      userIdCounter = old.userIdCounter;
      layananCounter = old.layananCounter;
      layananMap = old.layananMap;
      taskCounter = 0;
      nextTaskId = 1;
    };
  };
};
