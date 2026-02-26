import Text "mo:core/Text";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Migration "migration";
import Time "mo:core/Time";
import Int "mo:core/Int";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// Use migration function during upgrade
(with migration = Migration.run)
actor {
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

  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  var users : [User] = [];
  var userIdCounter : Nat = 1;

  func roleToText(role : Role) : Text {
    switch (role) {
      case (#admin) { "admin" };
      case (#adminuser) { "adminuser" };
      case (#adminfinance) { "adminfinance" };
      case (#concierge) { "concierge" };
      case (#asistenmu) { "asistenmu" };
      case (#client) { "client" };
      case (#partner) { "partner" };
      case (#guest) { "guest" };
    };
  };

  func findUserByPrincipal(p : Principal) : ?User {
    let pid = p.toText();
    users.find(func(u : User) : Bool { Text.equal(u.principalId, pid) });
  };

  // The first caller to invoke claimAdmin becomes the admin immediately (active status).
  // No approval or existing admin is required for this bootstrap action.
  public shared ({ caller }) func claimAdmin() : async { ok : Bool; message : Text } {
    let adminRole = #admin;
    let adminExists = users.any(func(u : User) : Bool { u.role == adminRole });

    if (adminExists) {
      return { ok = false; message = "Admin already claimed" };
    };

    let newUser : User = {
      idUser = userIdCounter.toText();
      principalId = caller.toText();
      nama = "Admin";
      email = "";
      whatsapp = "";
      status = "active";
      role = #admin;
    };

    users := users.concat([newUser]);
    userIdCounter += 1;

    // Use initialize for the bootstrap case: caller is not yet an admin,
    // so assignRole (which has an admin-only guard) cannot be used here.
    AccessControl.initialize(accessControlState, caller, "", "");

    { ok = true; message = "Admin created successfully" };
  };

  public query func isAdminClaimed() : async Bool {
    users.any(func(u : User) : Bool {
      switch (u.role) {
        case (#admin) { true };
        case (_) { false };
      };
    });
  };

  type RegisterUserResponse = {
    ok : Bool;
    idUser : Text;
    message : Text;
  };

  public type UserProfile = {
    idUser : Text;
    nama : Text;
    email : Text;
    whatsapp : Text;
    role : Text;
    status : Text;
  };

  public shared ({ caller }) func registerUser(
    principalId : Text,
    nama : Text,
    email : Text,
    whatsapp : Text,
    role : Role,
    company : ?Text,
    kota : ?Text,
  ) : async RegisterUserResponse {
    let idUser = userIdCounter.toText();

    let newUser : User = {
      idUser;
      principalId;
      nama;
      email;
      whatsapp;
      status = "pending";
      role;
    };

    users := users.concat([newUser]);
    userIdCounter += 1;

    {
      ok = true;
      idUser;
      message = "User registered successfully";
    };
  };

  public query ({ caller }) func getUserByPrincipal(principalId : Text) : async ?{
    idUser : Text;
    nama : Text;
    role : Text;
    status : Text;
  } {
    let callerText = caller.toText();
    if (not Text.equal(callerText, principalId)) {
      Runtime.trap("Unauthorized: You can only retrieve your own profile");
    };

    switch (users.find(func(u : User) : Bool { Text.equal(u.principalId, principalId) })) {
      case (null) { null };
      case (?u) {
        ?{
          idUser = u.idUser;
          nama = u.nama;
          role = roleToText(u.role);
          status = u.status;
        };
      };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can fetch their profile");
    };
    switch (findUserByPrincipal(caller)) {
      case (null) { null };
      case (?u) {
        ?{
          idUser = u.idUser;
          nama = u.nama;
          email = u.email;
          whatsapp = u.whatsapp;
          role = roleToText(u.role);
          status = u.status;
        };
      };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async { ok : Bool; message : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can save their profile");
    };

    let callerText = caller.toText();
    let idx = users.findIndex(func(u : User) : Bool { Text.equal(u.principalId, callerText) });

    switch (idx) {
      case (null) {
        { ok = false; message = "User not found" };
      };
      case (?i) {
        let existing = users[i];
        let updated : User = {
          existing with
          nama = profile.nama;
          email = profile.email;
          whatsapp = profile.whatsapp;
        };
        users := Array.tabulate(users.size(), func(j : Nat) : User {
          if (j == i) { updated } else { users[j] };
        });
        { ok = true; message = "Profile updated successfully" };
      };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    let isOwner = Principal.equal(caller, user);

    if (not isOwner and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };

    switch (findUserByPrincipal(user)) {
      case (null) { null };
      case (?u) {
        ?{
          idUser = u.idUser;
          nama = u.nama;
          email = u.email;
          whatsapp = u.whatsapp;
          role = roleToText(u.role);
          status = u.status;
        };
      };
    };
  };

  // Returns the role of the calling principal
  public query ({ caller }) func getUserRole() : async ?Role {
    switch (findUserByPrincipal(caller)) {
      case (null) { null };
      case (?user) { ?user.role };
    };
  };

  type LayananStatus = {
    #aktif;
    #tidakAktif;
  };

  type Task = {
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

  var taskCounter : Nat = 0;
  var layananCounter : Nat = 0;
  var nextTaskId : Nat = 1;

  var layananMap : Map.Map<Nat, Layanan> = Map.empty<Nat, Layanan>();

  func layananStatusToText(status : LayananStatus) : Text {
    switch (status) {
      case (#aktif) { "active" };
      case (#tidakAktif) { "inactive" };
    };
  };

  func callerIsAdminFinance(caller : Principal) : Bool {
    switch (findUserByPrincipal(caller)) {
      case (null) { false };
      case (?u) {
        switch (u.role) {
          case (#adminfinance) { true };
          case (#admin) { true };
          case (_) { false };
        };
      };
    };
  };

  func callerIsSuperadminOrAdminFinance(caller : Principal) : Bool {
    switch (findUserByPrincipal(caller)) {
      case (null) { false };
      case (?u) {
        switch (u.role) {
          case (#admin) { true };
          case (#adminfinance) { true };
          case (_) { false };
        };
      };
    };
  };

  // Authenticated createTask: validates tanyaJawab layanan is active & owned by caller
  public shared ({ caller }) func createTask(
    tipeLayanan : Text,
    judulTask : Text,
    detailTask : Text,
    deadline : Int,
  ) : async Task {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can create tasks");
    };

    // Validate tanyaJawab layanan is milik caller dan aktif
    if (not isTanyaJawabActiveForCaller(caller)) {
      Runtime.trap("Tanya Jawab layanan must be active and owned by caller");
    };

    let task : Task = {
      id = nextTaskId.toText();
      tipeLayanan;
      judulTask;
      detailTask;
      deadline;
      createdAt = Time.now();
    };

    nextTaskId += 1;
    task;
  };

  // Helper function to check if tanyaJawab layanan is active & owned by caller
  func isTanyaJawabActiveForCaller(caller : Principal) : Bool {
    layananMap.values().toArray().any(
      func(l : Layanan) : Bool {
        l.clientId == caller and l.status == #aktif
      }
    );
  };

  public query func getAllLayanan() : async [Layanan] {
    layananMap.values().toArray();
  };

  // createLayanan: requires adminFinance (or admin) role
  public shared ({ caller }) func createLayanan(name : Text, clientId : Principal) : async Layanan {
    if (not callerIsAdminFinance(caller)) {
      Runtime.trap("Unauthorized: Only adminFinance can create layanan");
    };

    let newLayanan : Layanan = {
      id = layananCounter;
      name;
      status = #aktif;
      clientId;
    };

    layananMap.add(newLayanan.id, newLayanan);
    layananCounter += 1;
    newLayanan;
  };

  // updateLayananStatus: requires superadmin or adminFinance role
  public shared ({ caller }) func updateLayananStatus(id : Nat, newStatus : LayananStatus) : async Layanan {
    if (not callerIsSuperadminOrAdminFinance(caller)) {
      Runtime.trap("Unauthorized: Only superadmin and adminFinance can update layanan status");
    };

    switch (layananMap.get(id)) {
      case (null) { Runtime.trap("Layanan " # id.toText() # " not found") };
      case (?existingLayanan) {
        let updatedLayanan : Layanan = {
          existingLayanan with status = newStatus;
        };
        layananMap.add(id, updatedLayanan);
        updatedLayanan;
      };
    };
  };

  // getMyLayanan: authenticated query, filters by clientId == caller
  public query ({ caller }) func getMyLayanan() : async [Layanan] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can fetch their layanan");
    };
    let callerLayanan = layananMap.toArray().filter(
      func(kv : (Nat, Layanan)) : Bool { Principal.equal(kv.1.clientId, caller) }
    );
    callerLayanan.map(func(kv : (Nat, Layanan)) : Layanan { kv.1 });
  };
};
