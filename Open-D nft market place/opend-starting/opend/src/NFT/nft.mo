import Debug from "mo:base/Debug"

actor class NFT (name: Text, owner: Principal, content: [Nat8]) = this {                           //the argsg are used to initialize the actor class

    private let itemName = name;
    private var nftOwner = owner;                                                                       //changed from let so that we can change the owner of this nft during trades
    private let imageBytes = content;                                                                         //actual image data

    public query func getName(): async Text{
        return itemName;
    };
    
    public query func getOwner(): async Principal{
        return nftOwner;
    };

    public query func getasset(): async [Nat8]{
        return imageBytes;
    };

    public query func getCanisterId(): async [Principal]{
        return Principal.fromActor(this);                                                       //'this' to represent the actor class and all the things it expects
    };                                                                                          //return Principal.fromActor(NFT);  would be enough if this was just an actor. it takea an actor and returns the principal of that actor
    
   public shared(msg) func transferOwnership(newOwner): async Text{
      if (msg.caller == nftOwner){
        nftOwner := newOwner;
        return "Success";
      } else {
        return "Error: Not initiated by NFT owner";
      }
   }
}