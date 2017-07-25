pragma solidity ^0.4.2;


contract MetaCoin {


	uint[2] hi;

	function gethi() constant returns (uint) {
		return hi[0];
	}

	function MetaCoin() {
		/*balances[tx.origin] = 10000;*/
		hi[0] = 11743190143879054126547823499936786940072445367923631671448093764668266501;
		hi[1] = 44252715382497132370288884051270814479562518570755240081533;
	}


	function getPayline(uint8 i,uint8 y) constant returns (uint) {
		uint paypay;

		if (i <= 6){
			paypay = hi[0];
			return (paypay<<(256-i*42+(-y+2)*31))>>(256-i*42+(-y+2)*31+(i-1)*42 + (y-1)*11);
		}
		else {
			paypay = hi[1];
			return (paypay<<(256-(i-6)*42+(-y+2)*31))>>(256-(i-6)*42+(-y+2)*31+((i-6)-1)*42 + (y-1)*11);
		}
	}

}
