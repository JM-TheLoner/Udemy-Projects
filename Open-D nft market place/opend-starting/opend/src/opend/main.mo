import Principal "mo:base/Principal"
import NFTActorClass "../NFT/nft"
import Cycles "mo:base/ExperimentalCycles"
import HashMap "mo:base/HashMap"
import List "mo:base/List"
import Iter "mo:base/Iter"

actor OpenD {

   private type Listing = {                                                                                       //this is how you create a new data type. name begins with capital letters and the definition is inside the curly braces
      itemOwner: Principal;
      itemPrice: Nat;
   };
 
   var mapOfNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);             //key is a principal, NFTActorClass.NFT is the value
   var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);       //list because one owner can have many nfts with principals
   var mapOfListings = HashMap.HashMap<Principal, Listing>(1, Principal.equal, Principal.hash);                  //we want the value to be a custom type. We want to hold the owner's ID and price. and maybe in the future you'd even want to hold things like the historic record of sales, what price it was when it first sold, what price it was when it was sold the next time, what date stamp that happened on, etc

   public shared(msg) func mint(imgData: [Nat8], name: Text): async Principal{


      let owner: Principal = msg.caller;

      Cycles.add(100_500_000_000);                                                                                  //100 billion cycles to create a new canister. 500 million cycles in order to keep it up and running.

      let newNFT = await NFTActorClass.NFT(name, owner, imgData);                                                   //it is asynchronous

      let newNFTPrincipal = await newNFT.getCanisterId();                                                           //get the new principal
      
      mapOfNFTs.put(newNFTPrincipal, newNFT);

      //mapofowners.put cant work here. we have to get hold of the existing list that's stored for a particular user and then update that list and then push it back into the HashMap.

      addToOwner(owner, newNFTPrincipal);


      return newNFTPrincipal;         
   };

   private func addToOwner(owner: Principal, nftid: Principal){
      var ownedNFTs : List.List<Principal> = switch(mapOfOwners.get(owner)) {                                                //mapOfOwners.get(owner) gives an option like weve seen before. we will use a switch
         case null List.nil<Principal>();                                                                                  //for writing an empty list. parenthesis to initialize the empty list
         case (?result) result;  
      };                                                                                                                   //So what we've done here is we've safely gotten hold of the list of canister ids that are owned by this owner,

      ownedNFTs := List.push(nftid, ownedNFTs);                                                                            //we've taken the previous version of that list, added the new nftId, and then set that list to equal the new updated version of the list.

      mapOfOwners.put(owner, ownedNFTs);                                                                                   //adding it to mapofowners
      
   };

   public query func getOriginalOwner(id: Principal): async Principal{
      var lister: Listing = switch(mapOfListings.get(id)) {                                                                //gotten from the Listing datatype we made before
         case null return Principal.fromText("");
         case(?result) result;
      };

      return lister.itemOwner;
   }

   public query func getOwnedNFTs(user: Principal): async [Principal]{
      var userOwnedNFTs : List.List<Principal> = switch(mapOfOwners.get(owner)) {      
         case null List.nil<Principal>();                                              
         case (?result) result;  
      };

      return List.toArray(userOwnedNFTs);
   };

   public shared(msg) func listItem(id: Principal, price: Nat): async Text{
      //we're going to get hold of the item, the actual NFT, from our map of NFTs.

      var item : NFTActorClass = switch(mapOfNFTs.get(id)) {      
         case null return "NFT DOES NOT EXIST";                                             //And if in the case where we can't find the item with the id that was passed, then we're actually going to exit the rest of the function. We're not going to continue because there's no point.
         case (?result) result;  
      };

      //So the next thing we want to do is we want to get hold of the owner of this NFT that we are pulling up because we want to make sure that not just anyone is calling this listItem() method
      //we have to check that the person who's calling it, the msg.caller, is the same person as the owner of the item that's listed in our mapOfNFTs.

      let owner = await item.getOwner();

      if (Principal.equal(owner, msg.caller)){                                                 //we can check to see if the owner is the same as the msg.caller
         let newListing : Listing = {
            itemOwner := owner;
            itemPrice := price;
         };
         mapOfListings.put(id, newListing);
         return "Success";
      } else {
         return "You Don't Own The NFT";
      };

   };

   public query func getOpendCanisterId() : Principal{
      return Principal.fromActor(OpenD)
   };

    public query func isListed(id: Principal) : async Bool{
      if (mapOfListings.get(id) == null) {
         return false;
      } else {
         return true;
      }
   };

   public query func getListedNFTs(): async [Principal]{
      let ids = Iter.toArray(mapOfListings.keys())                                                                              //Iter datatype used to turnit to an array
      return ids
   };

   public query func getPrice(id: Principal): async Nat{
      var lister: Listing = switch(mapOfListings.get(id)) {                                                                //gotten from the Listing datatype we made before
         case null return 0;
         case(?result) result;
      };

      return lister.itemPrice;
   };


   //3 inputs: id of the NFT that's in question, ownerId (who sold it), newOwnerid (who bought it)
   public shared(msg) func completePurchase(id: Principal, ownerid: Principal, newownerid: Principal): async Text{                                                                 
      var purchasedNFT : NFTActorClass = switch(mapOfNFTs.get(id)) {      
         case null return "NFT DOES NOT EXIST";
         case (?result) result;  
      };

      let transferResult = await purchasedNFT.transferOwnership(newownerid)                  //And if the result that comes back from transferResult is "Success", then we're going to continue with deleting this item from our mapOfListings and also removing it from the previous owner's registered list of owned and NFTs.
      
      if (transferResult == "Success"){
        
         mapOfListings.delete(id);                                                     //remove from listed nfts
         
         var ownedNFTs : List.List<Principal> = switch(mapofowners.get(ownerid)) {     //get list of nfts owned by the one selling it
            case null List.Nil<Principal>();
            case (?result) result;
         };

      ownedNFTs := List.filter(ownedNFTs, func (listItemId: Principal) : Bool{                                                          //first arg is the list to work on, second is the condition. it works by returning a list of only items in the original list that fit the criteria given
         return listItemId != id;                                                                                          //return all ids except the one equal to the stated id
      });

      addToOwner(newownerid, id);
      return "Success";
      } else {
         return transferResult
      };
   };
};

