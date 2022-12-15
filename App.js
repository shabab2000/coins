import React, { useState, useEffect,useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Alert,
  FlatList,
  Linking,
  Share
} from 'react-native';
import { Icon, Header, Avatar } from "react-native-elements";
import SvgUri from 'react-native-svg-uri';
import axios from 'axios';
import BottomSheet from 'react-native-raw-bottom-sheet';
import RenderHtml from 'react-native-render-html';

export default function SearchScreen1({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [coin, setCoin] = useState([]);
  const [coinSearch, setCoinSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [select,setSelect] = useState(false);
  const [detail,setDetail] = useState('');
  const [limit, setLimit] = useState(10);

  const bottomSheetRef = useRef();
  
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  

  checkValidUrl = (url) => {
    var types = ['svg'];
    var parts = url.split('.');
    var extension = parts[parts.length-1];
    if(types.indexOf(extension) !== -1) {
        return true;   
    }
    }
   
    checkValidUrls = (url) => {
      var types = ['jpg','jpeg','tiff','png','gif','bmp','PNG'];
      var parts = url.split('.');
      var extension = parts[parts.length-1];
      if(types.indexOf(extension) !== -1) {
          return true;   
      }
      }

      const source = {
        html:detail.description
      };

  const config = {
    headers: {
      "x-access-token": "coinranking4e1700c46980ca8374c386d2cecf9e14575a9793fbfafca5"
    },
  };

  const coins = () => {
    axios.get('https://api.coinranking.com/v2/coins?limit='+limit,config).then(({ data }) => {
      setCoin(data.data.coins);
    });
  }

  const coinsSearch = () => {
    axios.get('https://api.coinranking.com/v2/coins?search='+searchText+'&limit='+limit,config).then(({ data }) => {
      setCoinSearch(data.data.coins);
    });
  }

function formatCount(n)
{
  if (n > 10**12 - 1) {
    return (n / 10**12).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d)+(.))/g, '$1,') + " trillion"
  }else if (n > 10**9 - 1) {
    return (n / 10**9).toFixed(2) + " billion"
  } else if (n > 10**6 - 1) {
    return (n / 10**6).toFixed(2) + " million"
  } else {
    return n !=null ?(n).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d)+(.))/g, '$1,'):null
  }
}

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};


  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Crypto buying and selling app.',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    axios.get('https://api.coinranking.com/v2/coins?limit='+limit,config).then(({ data }) => {
      setCoin(data.data.coins);
    });
    
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
  
    coins(); 

  }, []);
  return (
    <View style={{ flex: 1, paddingTop: 40 ,backgroundColor:'#fff'}}>
      <View style={styles.container}>
        <View style={styles.searchView}>
          <View style={styles.inputView}>
              <TouchableOpacity onPress={()=> coinsSearch()}>
              <Icon name="search" size={25} color="#d6d6d6" />
              </TouchableOpacity>
            
            <TextInput
              defaultValue={searchText}
              style={styles.input}
              placeholder=' Search'
              textContentType='name'
              onSubmitEditing={()=>coinsSearch()}
              onChangeText={(text) => {
                setSearchText(text);
                if(text.length<1){
                  setCoinSearch('');
                }
              }}
              returnKeyType='search'
            />
            {searchText.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  setSearchText('');
                  setCoinSearch('');
                }}
              >
                <Icon name='cancel' size={25} color='#d6d6d6' />
              </TouchableOpacity>
            ):null}
          </View>
        </View>
        <View style={{padding:10}} />
        <View style={{borderTopWidth:2,borderTopColor:'#eee'}} />
          
        <ScrollView contentContainerStyle={styles.scrollView}
       onScroll={({nativeEvent}) => {
      if (isCloseToBottom(nativeEvent)) {
        if(coinSearch){
          setLimit(limit*2);
          coinsSearch();
        }else{
          setLimit(limit*2);
          coins();
        }
      }
    }}
    scrollEventThrottle={400}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        {coinSearch ?  (
          coinSearch.length==0?
          <View style={{flex:1,alignItems:'center',justifyContent:'center',paddingTop:'70%'}}>
              <Text style={{fontWeight:'bold',fontSize:18}}>Sory</Text>
              <Text style={{fontSize:18}}>No result match this keyword</Text>
          </View>:
          <View>
          <Text style={{fontWeight: 'bold'}}>Buy, sell and hold crypto</Text>
            {coinSearch.map((user) => (
              <View>
             
              <TouchableOpacity
                style={styles.userCard}
                onPress={() => {
                  axios.get('https://api.coinranking.com/v2/coin/'+user.uuid,config).then(({ data }) => {
      setDetail(data.data.coin);
      setSelect(true);
    });
          bottomSheetRef.current.open();
                }}
              >
              
              { user.uuid=='aKzUVe4Hh_CON'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' }}
        />
        :user.uuid=='-l8Mn2pVlRs-p'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://www.kindpng.com/picc/m/127-1279698_ripple-coin-xrp-png-transparent-png.png' }}
        />
        :user.uuid=='D7B1x_ks7WhV5'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png' }}
        />
        :user.uuid=='qUhEFk1I61atv'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://cryptologos.cc/logos/tron-trx-logo.png' }}
        />
        :user.uuid=='_H5FVG9iW'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Uniswap_Logo.png' }}
        />
        :user.uuid=='x4WXHge-vvFY'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://seeklogo.com/images/W/wrapped-btc-wbtc-logo-8042E47E83-seeklogo.com.png' }}
        />
        :user.uuid=='f3iaFeCKEmkaZ'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://cryptologos.cc/logos/stellar-xlm-logo.png' }}
        />
        :user.uuid=='TpHE2IShQw-sJ'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://cryptologos.cc/logos/algorand-algo-logo.png' }}
        />
        :user.uuid=='ymQub4fuB'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://cryptologos.cc/logos/filecoin-fil-logo.png' }}
        />
        :user.uuid=='65PHZTpmE55b'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://cryptologos.cc/logos/cronos-cro-logo.png' }}
        />
        :user.uuid=='jad286TjB'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://cryptologos.cc/logos/hedera-hbar-logo.png' }}
        />
        :user.uuid=='omwkOTglq'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://cryptologos.cc/logos/elrond-egld-egld-logo.png' }}
        />
        :user.uuid=='iAzbfXiBBKkR6'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://cryptologos.cc/logos/eos-eos-logo.png' }}
        />
        : checkValidUrl(user.iconUrl)?(
          
        <SvgUri
      width={40}
      height={40}
      source={{ uri: user.iconUrl }}
    />         
              ):null}

              {checkValidUrls(user.iconUrl)?(
                <Image
                  style={styles.userImage}
                  source={{ uri: user.iconUrl }}
                />
              ):null}
              
              
                <View style={styles.userCardRight}>
                  <Text
                    style={{ fontSize: 14, fontWeight: '500',fontWeight: 'bold' }}
                  >{user.name.length < 23
                ? `${user.name}`
                : `${user.name.substring(0, 23)}...`}</Text>
                  <Text>{`${user.symbol}`}</Text>
                </View>
                <View style={{flex:1,alignItems:'flex-end'}}>
                  <Text
                    style={{ fontSize: 14, fontWeight: 'bold' }}
                  >${Number(user.price).toFixed(5).replace(/(\d)(?=(\d{3})+(?!\d)+(.))/g, '$1,')}</Text>
                  {user.change >=0?
                  <View style={{flexDirection:'row'}}>
                  <Icon name='arrow-up' type='ionicon' size={18} color='green' />
                  <Text  style={{color:'green',fontWeight: 'bold',fontSize:13}}>{user.change} %</Text>
                  </View>
                  :
                  <View style={{flexDirection:'row'}}>
                  <Icon name='arrow-down' type='ionicon' size={18} color='red' />
                  <Text style={{color:'red',fontWeight: 'bold',fontSize:13}}>{user.change} %</Text>
                  </View>
                  }
                </View>
              </TouchableOpacity>
              </View>
            ))}
            <View style={{ height: 50 }}></View>
          </View>
        ) : coinSearch.length < 0 ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageBoxText}>No user found</Text>
          </View>
        ) : (
          <View style={{flex:1,paddingTop:10}}>
          <Text><Text style={{fontWeight: 'bold'}}>Top <Text style={{color: '#a25754'}}>3</Text></Text> rank crypto</Text>
          {coin.length > 0 ? (
          <View>
          <FlatList
   data={coin} 
   showsHorizontalScrollIndicator={false}
   renderItem={({ item, index, separators }) => (
    <View>
    {item.rank<=3?
    <View style={{paddingRight:10}}>
      <TouchableOpacity key={index}
                style={styles.userCards}
                onPress={() => {
      axios.get('https://api.coinranking.com/v2/coin/'+item.uuid,config).then(({ data }) => {
      setDetail(data.data.coin);
      setSelect(true);
    });
          bottomSheetRef.current.open();
        }}
              >
              { checkValidUrl(item.iconUrl)?(
                <SvgUri
      width={40}
      height={40}
      source={{ uri: item.iconUrl }}
    />         
              ):null}

              {checkValidUrls(item.iconUrl)?(
                <Image
                  style={styles.userImage}
                  source={{ uri: item.iconUrl }}
                />
              ):null}
              
              
                <View style={{alignItems:'center'}}>
                <Text style={{fontWeight: 'bold'}}>{`${item.symbol}`}</Text>
                  <Text
                    style={{ fontSize: 14, fontWeight: '500', }}
                  >{item.name.length < 23
                ? `${item.name}`
                : `${item.name.substring(0, 23)}...`}</Text>
                  
                </View>
               
                  
                  {item.change >=0?
                  <View style={{flexDirection:'row'}}>
                  <Icon name='arrow-up' type='ionicon' size={18} color='green' />
                  <Text  style={{color:'green',fontWeight: 'bold',fontSize:13}}>{item.change}%</Text>
                  </View>
                  :
                  <View style={{flexDirection:'row'}}>
                  <Icon name='arrow-down' type='ionicon' size={18} color='red' />
                  <Text style={{color:'red',fontWeight: 'bold',fontSize:13}}>{item.change}%</Text>
                  </View>
                  }
              </TouchableOpacity>
              </View>
      :null}
    </View>
   )}
   keyExtractor={item => item.uuid} 
   horizontal={true} 
 />
 <Text style={{fontWeight: 'bold'}}>Buy, sell and hold crypto</Text>
            {coin.map((user) => (
              <View>
             
              {user.rank>3?
              <TouchableOpacity
                style={styles.userCard}
                onPress={() => {
                  axios.get('https://api.coinranking.com/v2/coin/'+user.uuid,config).then(({ data }) => {
      setDetail(data.data.coin);
      setSelect(true);
    });
          bottomSheetRef.current.open();
                }}
              >
              
              { user.uuid=='aKzUVe4Hh_CON'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' }}
        />
        :user.uuid=='-l8Mn2pVlRs-p'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://www.kindpng.com/picc/m/127-1279698_ripple-coin-xrp-png-transparent-png.png' }}
        />
        :user.uuid=='D7B1x_ks7WhV5'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png' }}
        />
        :user.uuid=='qUhEFk1I61atv'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://cryptologos.cc/logos/tron-trx-logo.png' }}
        />
        :user.uuid=='_H5FVG9iW'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Uniswap_Logo.png' }}
        />
        :user.uuid=='x4WXHge-vvFY'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://seeklogo.com/images/W/wrapped-btc-wbtc-logo-8042E47E83-seeklogo.com.png' }}
        />
        :user.uuid=='f3iaFeCKEmkaZ'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://cryptologos.cc/logos/stellar-xlm-logo.png' }}
        />
        :user.uuid=='TpHE2IShQw-sJ'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://cryptologos.cc/logos/algorand-algo-logo.png' }}
        />
        :user.uuid=='ymQub4fuB'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://cryptologos.cc/logos/filecoin-fil-logo.png' }}
        />
        :user.uuid=='65PHZTpmE55b'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://cryptologos.cc/logos/cronos-cro-logo.png' }}
        />
        :user.uuid=='jad286TjB'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://cryptologos.cc/logos/hedera-hbar-logo.png' }}
        />
        :user.uuid=='omwkOTglq'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://cryptologos.cc/logos/elrond-egld-egld-logo.png' }}
        />
        :user.uuid=='iAzbfXiBBKkR6'?
        <Image
            style={styles.userImage}
            source={{ uri: 'https://cryptologos.cc/logos/eos-eos-logo.png' }}
        />
        : checkValidUrl(user.iconUrl)?(
                <SvgUri
      width={40}
      height={40}
      source={{ uri: user.iconUrl }}
    />         
              ):null}

              {checkValidUrls(user.iconUrl)?(
                <Image
                  style={styles.userImage}
                  source={{ uri: user.iconUrl }}
                />
              ):null}
              
              
                <View style={styles.userCardRight}>
                  <Text
                    style={{ fontSize: 14, fontWeight: '500',fontWeight: 'bold' }}
                  >{user.name.length < 23
                ? `${user.name}`
                : `${user.name.substring(0, 23)}...`}</Text>
                  <Text>{`${user.symbol}`}</Text>
                </View>
                <View style={{flex:1,alignItems:'flex-end'}}>
                  <Text
                    style={{ fontSize: 14, fontWeight: 'bold' }}
                  >${Number(user.price).toFixed(5).replace(/(\d)(?=(\d{3})+(?!\d)+(.))/g, '$1,')}</Text>
                  {user.change >=0?
                  <View style={{flexDirection:'row'}}>
                  <Icon name='arrow-up' type='ionicon' size={18} color='green' />
                  <Text  style={{color:'green',fontWeight: 'bold',fontSize:13}}>{user.change} %</Text>
                  </View>
                  :
                  <View style={{flexDirection:'row'}}>
                  <Icon name='arrow-down' type='ionicon' size={18} color='red' />
                  <Text style={{color:'red',fontWeight: 'bold',fontSize:13}}>{user.change} %</Text>
                  </View>
                  }
                </View>
              </TouchableOpacity>
              :null}
             
              </View>
            ))}
            <TouchableOpacity onPress={()=> onShare()}
                style={styles.userCardn}>
                <View style={{backgroundColor:'#fff',borderRadius:50,padding:5}}>
              <Image style={{width:20,height:20}} source={require('./img/img.png')}/>
              </View>
              <View style={{paddingLeft:1}}>
            <Text style={{fontSize:16,fontWeight:'bold'}}>You can earn $10 when you invite a friend to buy crypto.<Text style={{color:'#73addf'}}>Invite your friend</Text></Text>
            </View>
            </TouchableOpacity>
            <View style={{ height: 50 }}></View>
          </View>
        ) :null}
          </View>
        )}
        
        <BottomSheet
        ref={bottomSheetRef}
        closeOnDragDown={false}
        height={500}
        openDuration={250}
        onClose={()=>{setSelect(false);setDetail('')}}
      >
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#fff',
            //alignItems: 'center',
            paddingTop: 10,
          }}
        >
        
        <View style={{display:'flex',flexDirection:'row',padding:15}}>

        <View style={{paddingRight:15}}>

        {select? detail.uuid=='aKzUVe4Hh_CON'?
        <Image
                  style={styles.userImages}
                  source={{ uri: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' }}
        />
        :detail.uuid=='-l8Mn2pVlRs-p'?
        <Image
            style={styles.userImages}
            source={{ uri: 'https://www.kindpng.com/picc/m/127-1279698_ripple-coin-xrp-png-transparent-png.png' }}
        />
        :detail.uuid=='D7B1x_ks7WhV5'?
        <Image
            style={styles.userImages}
            source={{ uri: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png' }}
        />
        :detail.uuid=='qUhEFk1I61atv'?
        <Image
            style={styles.userImages}
            source={{ uri: 'https://cryptologos.cc/logos/tron-trx-logo.png' }}
        />
        :detail.uuid=='_H5FVG9iW'?
        <Image
            style={styles.userImages}
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Uniswap_Logo.png' }}
        />
        :detail.uuid=='x4WXHge-vvFY'?
        <Image
            style={styles.userImages}
            source={{ uri: 'https://seeklogo.com/images/W/wrapped-btc-wbtc-logo-8042E47E83-seeklogo.com.png' }}
        />
        :detail.uuid=='f3iaFeCKEmkaZ'?
        <Image
            style={styles.userImages}
            source={{ uri: 'https://cryptologos.cc/logos/stellar-xlm-logo.png' }}
        />
        :detail.uuid=='TpHE2IShQw-sJ'?
        <Image
            style={styles.userImages}
            source={{ uri: 'https://cryptologos.cc/logos/algorand-algo-logo.png' }}
        />
        :detail.uuid=='ymQub4fuB'?
        <Image
            style={styles.userImages}
            source={{ uri: 'https://cryptologos.cc/logos/filecoin-fil-logo.png' }}
        />
        :detail.uuid=='65PHZTpmE55b'?
        <Image
            style={styles.userImages}
            source={{ uri: 'https://cryptologos.cc/logos/cronos-cro-logo.png' }}
        />
        :detail.uuid=='jad286TjB'?
        <Image
            style={styles.userImages}
            source={{ uri: 'https://cryptologos.cc/logos/hedera-hbar-logo.png' }}
        />
        :detail.uuid=='omwkOTglq'?
        <Image
            style={styles.userImages}
            source={{ uri: 'https://cryptologos.cc/logos/elrond-egld-egld-logo.png' }}
        />
        :detail.uuid=='iAzbfXiBBKkR6'?
        <Image
            style={styles.userImages}
            source={{ uri: 'https://cryptologos.cc/logos/eos-eos-logo.png' }}
        />
        : checkValidUrl(detail.iconUrl)?(
                <SvgUri
      width={50}
      height={50}
      source={{ uri: detail.iconUrl }}
    />         
              ):null:null}

              {select? checkValidUrls(detail.iconUrl)?(
                <Image
                  style={styles.userImages}
                  source={{ uri: detail.iconUrl }}
                />
              ):null:null}
              </View>
              {detail?
              <View>
              <Text><Text style={{fontWeight: 'bold',fontSize:16,color:detail.color}}>{detail.name}</Text><Text style={{fontWeight: 'bold'}}> ({detail.symbol})</Text></Text>
              <Text style={{fontWeight: 'bold',fontSize:12}}>PRICE  $ {Number(detail.price).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d)+(.))/g, '$1,')}</Text>
              <Text style={{fontWeight: 'bold',fontSize:12}}>MARKET CAP  $ {formatCount(detail.marketCap)} </Text>
              </View>:null}
              </View>
      <ScrollView style={{paddingHorizontal:15}}>
        <RenderHtml
      //contentWidth={width}
      source={source}
    />
        </ScrollView>
        <View style={{borderTopWidth:1,borderTopColor:'#ddd'}}>
        <TouchableOpacity onPress={()=> {
          Linking.openURL(detail.websiteUrl)
        }}>
          <Text style={{textAlign:'center',color:'#8cb8e5',padding:10,fontWeight: 'bold'}}>GO TO WEBSITE</Text>
          </TouchableOpacity>
        </View>
        </View>
      </BottomSheet>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  searchView: {
    display: 'flex',
    flexDirection: 'row',
  },
  inputView: {
    flex: 1,
    height: 40,
    backgroundColor: '#eeeeee',
    paddingHorizontal: 10,
    borderRadius: 6,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 13,
  },
  userCard: {
    paddingTop: 15,
    paddingBottom:15,
    backgroundColor: '#f9f9f9',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userCards: {
  width:105,
    paddingTop: 15,
    paddingBottom:15,
    backgroundColor: '#f9f9f9',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginTop: 10,
    display: 'flex',
    alignItems: 'center',
  },
  userCardn: {
    paddingTop: 15,
    paddingBottom:15,
    backgroundColor: '#cbe5fc',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
  },
  userImages: {
    width: 60,
    height: 60,
  },
  userCardRight: {
    paddingHorizontal: 10,
  },
  messageBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBoxText: {
    fontSize: 20,
    fontWeight: '500',
  },
});