import Text "mo:core/Text";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import List "mo:core/List";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

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

  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  var users : [User] = [];
  var userIdCounter : Nat = 1;
  var layananCounter : Nat = 0;
  var nextTaskId : Nat = 1;
  var delegationCounter : Nat = 1;
  var topUpCounter : Nat = 1;
  var financialUpdateRequestCounter : Nat = 1;

  var taskMap : Map.Map<Text, TaskRecord> = Map.empty<Text, TaskRecord>();
  var layananMap : Map.Map<Nat, Layanan> = Map.empty<Nat, Layanan>();
  var delegationMap : Map.Map<Nat, Delegation> = Map.empty<Nat, Delegation>();
  var unitTopUpMap : Map.Map<Nat, UnitTopUp> = Map.empty<Nat, UnitTopUp>();
  var financialProfiles : Map.Map<Principal, FinancialProfile> = Map.empty<Principal, FinancialProfile>();
  var financialUpdateRequests : Map.Map<Text, FinancialProfileUpdateRequest> = Map.empty<Text, FinancialProfileUpdateRequest>();

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

  func pluralRoleToText(role : Role) : Text {
    switch (role) {
      case (#admin) { "admin" };
      case (#adminuser) { "adminuser" };
      case (#adminfinance) { "adminfinance" };
      case (#concierge) { "concierge" };
      case (#asistenmu) { "asistenmu" };
      case (#client) { "clients" };
      case (#partner) { "partners" };
      case (#guest) { "guests" };
    };
  };

  func layananStatusToText(status : LayananStatus) : Text {
    switch (status) {
      case (#aktif) { "active" };
      case (#tidakAktif) { "inactive" };
    };
  };

  func taskStatusToText(status : TaskStatus) : Text {
    switch (status) {
      case (#open) { "open" };
      case (#inProgress) { "inProgress" };
      case (#memintaReview) { "memintaReview" };
      case (#selesai) { "selesai" };
      case (#cancelled) { "cancelled" };
    };
  };

  func findUserByPrincipal(p : Principal) : ?User {
    let pid = p.toText();
    users.find(func(u : User) : Bool { Text.equal(u.principalId, pid) });
  };

  func isRole(caller : Principal, targetRole : Role) : Bool {
    switch (findUserByPrincipal(caller)) {
      case (null) { false };
      case (?user) { user.role == targetRole };
    };
  };

  func isAnyRole(caller : Principal, roles : [Role]) : Bool {
    switch (findUserByPrincipal(caller)) {
      case (null) { false };
      case (?user) { roles.any(func(r) { r == user.role }) };
    };
  };

  func ensureRole(caller : Principal, role : Role, action : Text) {
    if (not isRole(caller, role)) {
      Runtime.trap("Unauthorized: Only " # pluralRoleToText(role) # " can " # action);
    };
  };

  func ensureAnyRole(caller : Principal, roles : [Role], action : Text) {
    let rolesList = List.fromArray<Role>(roles);
    if (not isAnyRole(caller, roles)) {
      Runtime.trap(
        "Unauthorized: Only "
        # rolesList.map<Role, Text>(pluralRoleToText).toArray().concat(
            [action],
          ).toText(),
      );
    };
  };

  // ─── Admin Bootstrap ────────────────────────────────────────────────────────

  public shared ({ caller }) func claimAdmin() : async { ok : Bool; message : Text } {
    let adminRole = #admin;
    let adminExists = users.any(func(u) { u.role == adminRole });

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
      sharePercentage = 0;
    };

    users := users.concat([newUser]);
    userIdCounter += 1;
    AccessControl.initialize(accessControlState, caller, "", "");

    { ok = true; message = "Admin created successfully" };
  };

  public query func isAdminClaimed() : async Bool {
    users.any(func(u) { u.role == #admin });
  };

  // ─── User Management ────────────────────────────────────────────────────────

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
    sharePercentage : Nat,
  ) : async RegisterUserResponse {
    if (not isAnyRole(caller, [#admin, #adminuser])) {
      Runtime.trap("Unauthorized: Only admins or adminuser staff can register users");
    };

    let idUser = userIdCounter.toText();

    let newUser : User = {
      idUser;
      principalId;
      nama;
      email;
      whatsapp;
      status = "pending";
      role;
      sharePercentage;
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
    if (not Text.equal(callerText, principalId) and not isRole(caller, #admin)) {
      Runtime.trap("Unauthorized: You can only retrieve your own profile");
    };

    switch (users.find(func(u) { Text.equal(u.principalId, principalId) })) {
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
    let idx = users.findIndex(func(u) { Text.equal(u.principalId, callerText) });

    switch (idx) {
      case (null) { { ok = false; message = "User not found" } };
      case (?i) {
        let existing = users[i];
        let updated : User = {
          existing with
          nama = profile.nama;
          email = profile.email;
          whatsapp = profile.whatsapp;
        };
        users := Array.tabulate(users.size(), func(j) { if (j == i) { updated } else { users[j] } });
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

  public query ({ caller }) func getUserRole() : async ?Role {
    switch (findUserByPrincipal(caller)) {
      case (null) { null };
      case (?user) { ?user.role };
    };
  };

  public shared ({ caller }) func approveUser(principalId : Text, _approved : Bool) : async { ok : Bool; message : Text } {
    if (not isRole(caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can approve users");
    };
    { ok = true; message = "Functionality not needed in current scope" };
  };

  public query ({ caller }) func getAllUsers() : async [UserProfile] {
    if (not isAnyRole(caller, [#admin, #adminuser])) {
      Runtime.trap("Unauthorized: Only admins or adminuser staff can list all users");
    };
    users.map(func(u) {
      {
        idUser = u.idUser;
        nama = u.nama;
        email = u.email;
        whatsapp = u.whatsapp;
        role = roleToText(u.role);
        status = u.status;
      }
    });
  };

  public query ({ caller }) func getClientCount() : async Nat {
    if (not isAnyRole(caller, [#admin, #adminuser])) {
      Runtime.trap("Unauthorized: Only admins or adminuser staff can view client counts");
    };
    users.filter(func(u) {
      switch (u.role) { case (#client) { true }; case (_) { false } }
    }).size();
  };

  public query ({ caller }) func getPartnerCount() : async Nat {
    if (not isAnyRole(caller, [#admin, #adminuser])) {
      Runtime.trap("Unauthorized: Only admins or adminuser staff can view partner counts");
    };
    users.filter(func(u) {
      switch (u.role) { case (#partner) { true }; case (_) { false } }
    }).size();
  };

  public query ({ caller }) func getAsistenmuCount() : async Nat {
    if (not isAnyRole(caller, [#admin, #adminuser])) {
      Runtime.trap("Unauthorized: Only admins or adminuser staff can view asistenmu counts");
    };
    users.filter(func(u) {
      switch (u.role) { case (#asistenmu) { true }; case (_) { false } }
    }).size();
  };

  public query ({ caller }) func getInternalStaffCount() : async Nat {
    if (not isAnyRole(caller, [#admin, #adminuser])) {
      Runtime.trap("Unauthorized: Only admins or adminuser staff can view staff counts");
    };
    users.filter(func(u) {
      switch (u.role) {
        case (#adminuser) { true };
        case (#adminfinance) { true };
        case (#concierge) { true };
        case (_) { false };
      }
    }).size();
  };

  public query ({ caller }) func getActiveClients() : async [UserProfile] {
    if (not isAnyRole(caller, [#admin, #adminuser])) {
      Runtime.trap("Unauthorized: Only admins or adminuser staff can list active clients");
    };
    users.filter(func(u) {
      switch (u.role) { case (#client) { Text.equal(u.status, "active") }; case (_) { false } }
    }).map(func(u) {
      {
        idUser = u.idUser;
        nama = u.nama;
        email = u.email;
        whatsapp = u.whatsapp;
        role = roleToText(u.role);
        status = u.status;
      }
    });
  };

  public query ({ caller }) func getActivePartners() : async [UserProfile] {
    if (not isAnyRole(caller, [#admin, #adminuser])) {
      Runtime.trap("Unauthorized: Only admins or adminuser staff can list active partners");
    };
    users.filter(func(u) {
      switch (u.role) { case (#partner) { Text.equal(u.status, "active") }; case (_) { false } }
    }).map(func(u) {
      {
        idUser = u.idUser;
        nama = u.nama;
        email = u.email;
        whatsapp = u.whatsapp;
        role = roleToText(u.role);
        status = u.status;
      }
    });
  };

  public query ({ caller }) func getActiveAsistenmu() : async [UserProfile] {
    if (not isAnyRole(caller, [#admin, #adminuser])) {
      Runtime.trap("Unauthorized: Only admins or adminuser staff can list active asistenmu");
    };
    users.filter(func(u) {
      switch (u.role) { case (#asistenmu) { Text.equal(u.status, "active") }; case (_) { false } }
    }).map(func(u) {
      {
        idUser = u.idUser;
        nama = u.nama;
        email = u.email;
        whatsapp = u.whatsapp;
        role = roleToText(u.role);
        status = u.status;
      }
    });
  };

  public query ({ caller }) func getActiveInternalStaff() : async [UserProfile] {
    if (not isAnyRole(caller, [#admin, #adminuser])) {
      Runtime.trap("Unauthorized: Only admins or adminuser staff can list internal staff");
    };
    users.filter(func(u) {
      let isInternal = switch (u.role) {
        case (#adminuser) { true };
        case (#adminfinance) { true };
        case (#concierge) { true };
        case (_) { false };
      };
      isInternal and Text.equal(u.status, "active");
    }).map(func(u) {
      {
        idUser = u.idUser;
        nama = u.nama;
        email = u.email;
        whatsapp = u.whatsapp;
        role = roleToText(u.role);
        status = u.status;
      }
    });
  };

  // ─── Layanan ────────────────────────────────────────────────────────────────

  public query ({ caller }) func getAllLayanan() : async [Layanan] {
    if (not isAnyRole(caller, [#admin, #adminuser, #adminfinance, #concierge, #asistenmu])) {
      Runtime.trap("Unauthorized: Only internal staff can list all layanan");
    };
    layananMap.values().toArray();
  };

  public shared ({ caller }) func createLayanan(name : Text, clientId : Principal, hargaPerUnit : Nat) : async Layanan {
    ensureRole(caller, #adminfinance, "create layanan");

    let newLayanan : Layanan = {
      id = layananCounter;
      name;
      status = #aktif;
      clientId;
      hargaPerUnit;
      unitBalance = 0;
    };

    layananMap.add(newLayanan.id, newLayanan);
    layananCounter += 1;
    newLayanan;
  };

  public shared ({ caller }) func activateLayanan(layananId : Nat) : async Layanan {
    ensureRole(caller, #adminfinance, "activate layanan");

    switch (layananMap.get(layananId)) {
      case (null) { Runtime.trap("Layanan not found") };
      case (?existing) {
        let updated : Layanan = { existing with status = #aktif };
        layananMap.add(layananId, updated);
        updated;
      };
    };
  };

  public shared ({ caller }) func topUpUnits(clientId : Principal, layananId : Nat, units : Nat, paymentAmount : Nat) : async { ok : Bool; message : Text } {
    ensureRole(caller, #adminfinance, "top up units");

    switch (layananMap.get(layananId)) {
      case (null) { Runtime.trap("Layanan not found") };
      case (?layanan) {
        if (not Principal.equal(layanan.clientId, clientId)) {
          Runtime.trap("Layanan does not belong to specified client");
        };

        if (paymentAmount != units * layanan.hargaPerUnit) {
          Runtime.trap("Incorrect payment amount");
        };

        let newTopUp : UnitTopUp = {
          topUpId = topUpCounter;
          clientId;
          layananId;
          unitsAdded = units;
          pricePerUnit = layanan.hargaPerUnit;
          totalCost = paymentAmount;
          timestamp = Time.now();
          approvedBy = caller;
        };

        unitTopUpMap.add(newTopUp.topUpId, newTopUp);
        topUpCounter += 1;

        let updatedLayanan : Layanan = { layanan with unitBalance = layanan.unitBalance + units };
        layananMap.add(layananId, updatedLayanan);

        { ok = true; message = "Units topped up successfully" };
      };
    };
  };

  public query ({ caller }) func getMyLayanan() : async [Layanan] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can fetch their layanan");
    };
    let callerLayanan = layananMap.toArray().filter(
      func(kv) { Principal.equal(kv.1.clientId, caller) }
    );
    callerLayanan.map(func(kv) { kv.1 });
  };

  public query ({ caller }) func getActiveLayanan(page : Nat) : async [Layanan] {
    if (not isAnyRole(caller, [#admin, #adminfinance])) {
      Runtime.trap("Unauthorized: Only admins or adminfinance staff can view active layanan");
    };

    let activeLayanan = layananMap.values().toArray().filter(
      func(l) { l.status == #aktif }
    );

    let start = page * 10;
    if (start >= activeLayanan.size()) {
      return [];
    };

    let end = Int.min(start + 10, activeLayanan.size().toInt()).toNat();
    Array.tabulate<Layanan>(end - start, func(i) { activeLayanan[start + i] });
  };

  public query ({ caller }) func getPaginatedLayanan(page : Nat) : async [Layanan] {
    if (not isAnyRole(caller, [#admin, #adminfinance])) {
      Runtime.trap("Unauthorized: Only admins or adminfinance staff can view paginated layanan");
    };

    let activeLayanan = layananMap.values().toArray().filter(
      func(l) { l.status == #aktif }
    );

    let start = page * 10;
    if (start >= activeLayanan.size()) {
      return [];
    };

    let end = Int.min(start + 10, activeLayanan.size().toInt()).toNat();
    Array.tabulate<Layanan>(end - start, func(i) { activeLayanan[start + i] });
  };

  // ─── Tasks ──────────────────────────────────────────────────────────────────

  func isTanyaJawabActiveForCaller(caller : Principal) : Bool {
    layananMap.values().toArray().any(
      func(l) { l.clientId == caller and l.status == #aktif }
    );
  };

  public shared ({ caller }) func createTask(
    tipeLayanan : Text,
    judulTask : Text,
    detailTask : Text,
    deadline : Int,
    gdrive_internal : ?Text,
    gdrive_client : ?Text,
  ) : async TaskRecord {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can create tasks");
    };

    ensureRole(caller, #client, "create tasks");

    if (not isTanyaJawabActiveForCaller(caller)) {
      Runtime.trap("Tanya Jawab layanan must be active and owned by caller");
    };

    let taskId = nextTaskId.toText();
    let task : TaskRecord = {
      id = taskId;
      tipeLayanan;
      judulTask;
      detailTask;
      deadline;
      createdAt = Time.now();
      status = #open;
      clientId = caller;
      partnerId = null;
      gdrive_internal;
      gdrive_client;
    };

    taskMap.add(taskId, task);
    nextTaskId += 1;
    task;
  };

  public shared ({ caller }) func assignTaskToPartner(
    taskId : Text,
    partnerId : Principal,
    delegationId : Nat,
    assignedBy : Principal,
  ) : async TaskRecord {
    ensureAnyRole(caller, [#admin, #concierge, #asistenmu], "assign tasks to partners");

    switch (taskMap.get(taskId)) {
      case (null) { Runtime.trap("Task not found: " # taskId) };
      case (?task) {
        let updated : TaskRecord = {
          task with
          partnerId = ?partnerId;
          status = #inProgress;
        };
        taskMap.add(taskId, updated);

        delegationMap.add(delegationId, {
          delegationId;
          taskId;
          partnerId;
          deadline = 0;
          jamEfektifPengerjaan = 0;
          unitLayananTerpakai = 0;
          status = "active";
          createdAt = Time.now();
          updatedAt = Time.now();
          assignedBy;
        });

        updated;
      };
    };
  };

  public shared ({ caller }) func createDelegation(
    taskId : Text,
    partnerId : Principal,
    deadline : Int,
    jamEfektifPengerjaan : Nat,
    unitLayananTerpakai : Nat,
  ) : async Delegation {
    ensureAnyRole(caller, [#admin, #concierge, #asistenmu], "create delegations");

    switch (taskMap.get(taskId)) {
      case (null) { Runtime.trap("Task not found: " # taskId) };
      case (?task) {
        let delegation : Delegation = {
          delegationId = delegationCounter;
          taskId;
          partnerId;
          deadline;
          jamEfektifPengerjaan;
          unitLayananTerpakai;
          status = "active";
          createdAt = Time.now();
          updatedAt = Time.now();
          assignedBy = caller;
        };

        delegationMap.add(delegationCounter, delegation);
        delegationCounter += 1;

        let updated : TaskRecord = {
          task with
          partnerId = ?partnerId;
          status = #inProgress;
        };
        taskMap.add(taskId, updated);

        delegation;
      };
    };
  };

  public shared ({ caller }) func redelegateTask(
    delegationId : Nat,
    newPartnerId : Principal,
  ) : async TaskRecord {
    ensureAnyRole(caller, [#admin, #concierge], "re-delegate to other Partner");

    let existingDelegation = switch (delegationMap.get(delegationId)) {
      case (null) { Runtime.trap("Delegation " # delegationId.toText() # " not found") };
      case (?d) { d };
    };

    let updatedDelegation : Delegation = {
      existingDelegation with
      partnerId = newPartnerId;
      status = "redelegated";
      updatedAt = Time.now();
    };

    delegationMap.add(delegationId, updatedDelegation);

    switch (taskMap.get(existingDelegation.taskId)) {
      case (null) { Runtime.trap("Task not found: " # existingDelegation.taskId) };
      case (?task) {
        let updated : TaskRecord = {
          task with
          partnerId = ?newPartnerId;
          status = #inProgress;
        };
        taskMap.add(existingDelegation.taskId, updated);
        updated;
      };
    };
  };

  public shared ({ caller }) func partnerRequestsReview(taskId : Text) : async TaskRecord {
    ensureRole(caller, #partner, "request review");

    switch (taskMap.get(taskId)) {
      case (null) { Runtime.trap("Task not found: " # taskId) };
      case (?task) {
        switch (task.partnerId) {
          case (null) { Runtime.trap("No partner assigned to this task") };
          case (?pid) {
            if (not Principal.equal(pid, caller)) {
              Runtime.trap("Unauthorized: You are not assigned to this task");
            };
          };
        };
        if (task.status != #inProgress) {
          Runtime.trap("Task must be in progress to request review");
        };
        let updated : TaskRecord = { task with status = #memintaReview };
        taskMap.add(taskId, updated);
        updated;
      };
    };
  };

  public shared ({ caller }) func completeTask(taskId : Text) : async TaskRecord {
    ensureRole(caller, #client, "complete tasks");

    switch (taskMap.get(taskId)) {
      case (null) { Runtime.trap("Task not found: " # taskId) };
      case (?task) {
        if (not Principal.equal(task.clientId, caller)) {
          Runtime.trap("Unauthorized: You are not the client for this task");
        };

        if (task.status != #memintaReview) {
          Runtime.trap("Task must be in 'Meminta Review' state to be completed");
        };

        let updated : TaskRecord = { task with status = #selesai };
        taskMap.add(taskId, updated);
        updated;
      };
    };
  };

  public query ({ caller }) func getMyTasksAsClient() : async [TaskRecord] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can fetch their tasks");
    };
    taskMap.values().toArray().filter(
      func(t) { Principal.equal(t.clientId, caller) }
    );
  };

  public query ({ caller }) func getMyTasksAsPartner() : async [TaskRecord] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can fetch their tasks");
    };
    taskMap.values().toArray().filter(
      func(t) {
        switch (t.partnerId) {
          case (null) { false };
          case (?pid) { Principal.equal(pid, caller) };
        };
      }
    );
  };

  public query ({ caller }) func getAllTasks() : async [TaskRecord] {
    if (not isAnyRole(caller, [#admin, #adminuser, #concierge, #asistenmu])) {
      Runtime.trap("Unauthorized: Only admin or concierge can view all tasks");
    };
    taskMap.values().toArray();
  };

  // ─── Delegation Queries ─────────────────────────────────────────────────────

  public query ({ caller }) func getAllDelegations() : async [Delegation] {
    if (not isAnyRole(caller, [#admin, #adminuser, #concierge, #asistenmu])) {
      Runtime.trap("Unauthorized: Only internal staff can view all delegations");
    };
    delegationMap.values().toArray();
  };

  public query ({ caller }) func getMyDelegationsAsPartner() : async [Delegation] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can fetch their delegations");
    };
    delegationMap.values().toArray().filter(
      func(d) { Principal.equal(d.partnerId, caller) }
    );
  };

  public query ({ caller }) func getPartnerActiveEffectiveHours(partnerId : Principal) : async Nat {
    if (not isAnyRole(caller, [#admin, #adminuser, #concierge, #asistenmu])) {
      Runtime.trap("Unauthorized: Only internal staff can view partner effective hours");
    };
    let activeDelegations = delegationMap.values().toArray().filter(
      func(d) { Principal.equal(d.partnerId, partnerId) and Text.equal(d.status, "active") }
    );
    activeDelegations.values().foldLeft(0, func(acc, d) { acc + d.jamEfektifPengerjaan });
  };

  public query ({ caller }) func searchPartners(queryText : Text) : async [UserProfile] {
    if (not isAnyRole(caller, [#admin, #adminuser, #concierge, #asistenmu])) {
      Runtime.trap("Unauthorized: Only internal staff can search partners");
    };
    let lowerQuery = queryText.toLower();
    users.filter(func(u) {
      switch (u.role) {
        case (#partner) {
          u.principalId.toLower().contains(#text lowerQuery) or
          u.nama.toLower().contains(#text lowerQuery)
        };
        case (_) { false };
      }
    }).map(func(u) {
      {
        idUser = u.idUser;
        nama = u.nama;
        email = u.email;
        whatsapp = u.whatsapp;
        role = roleToText(u.role);
        status = u.status;
      }
    });
  };

  // ─── Top-Up History ─────────────────────────────────────────────────────────

  public query ({ caller }) func getAllTopUps() : async [UnitTopUp] {
    if (not isAnyRole(caller, [#admin, #adminfinance])) {
      Runtime.trap("Unauthorized: Only admins or adminfinance staff can view top-up records");
    };
    unitTopUpMap.values().toArray();
  };

  public query ({ caller }) func getClientTopUps(clientId : Principal) : async [UnitTopUp] {
    let isOwner = Principal.equal(caller, clientId);
    if (not isOwner and not isAnyRole(caller, [#admin, #adminfinance])) {
      Runtime.trap("Unauthorized: You can only view your own top-up records");
    };
    unitTopUpMap.values().toArray().filter(
      func(t) { Principal.equal(t.clientId, clientId) }
    );
  };
};
