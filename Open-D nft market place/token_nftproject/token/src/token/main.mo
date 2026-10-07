import Principal "mo:base/Principal"
import HashMap "mo:base/HashMap"
import Iter "mo:base/Iter"

actor Token {

    var owner : Principal = Principal.fromText("<principal>");                                                                    //Principal is the datatype. fromText converts text to principal
    var totalSupply : Nat = 1000000000;                                     
    var symbol : Text = "DANG";                                                                                                 //what shows on the exchange list like ETH, DOGE, USD etc.
    
    if (balances.size() < 1){
        balances.put(owner, totalSupply);                                                                                              //to run only if there are no users on launch as well
    }
    
    private stable var balanceEntries: [(Principal, Nat)]  = []                                                                                   //array Principal is datatype of first, Nat is datatype of second

    privatevar balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);                                          //this is the ledger. Principal is datatype of the key, Nat is datatype of the value, 1 is initial length of the hashmap

    public query func balanceOf(who: Principal ): async Nat {
        
        let balance : Nat = switch (balances.get(who)) {                                                                                   //dealing with the ?Nan
            case null 0;
            case(?result) result;
        };

        return balance;

    }
    public query func getSym(): async Text {
        
        return symbol;

    }
    public shared(msg) func payOut(): async Text {

        //Debug.print(debug_show(msg.caller))                                                                                 //msg.caller is the id of the person who called the function

        if (balances.get(msg.caller) == null){
            let amount = 10000;
            await transfer(msg.caller, amount);
            return "success";            
        } else {
            return "Already claimed free tokens";
        }

    }

    public shared(msg) func transfer(toAccount: Principal, amount: Nat) : async Text{                                           //msg.caller is who is transfered from
        let fromBal = await balanceOf(msg.caller);

        if (fromBal > amount){
            
            let newFromBal: Nat = fromBal - amount;
            balances.put(msg.caller, newFromBal);

            let toBal = await balanceOf(toAccount);

            let newTobal: Nat = toBal - amount;
            balances.put(toAccount, newTobal);


            return "success";
        } else {
            return "insufficient funds";
        }

    }

    system func preupgrade(){
        balanceEntries := Iter.toArray(balances.entries())                                                                                 //to assign balance to the balanceentries. the entries method is to allow the hashmap to be iterable over so it can be stored
    };
    system func postupgrade(){
        balances := HashMap.fromIter<Principal, Nat>(balanceEntries.val(), 1, Principal.equal, Principal.hash)                             //to assign the balanceentries to the balances after upgrade. the val method is to make the array iterable over

        if (balances.size() < 1){
            balances.put(owner, totalSupply);                                                                                              //to run only if there are no users
        }

        balanceEntries := []                                                                                                               //and then assing an empty attay to the balanceentries.
    };

};