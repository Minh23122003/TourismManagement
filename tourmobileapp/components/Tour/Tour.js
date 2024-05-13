import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import APIs, { endpoints } from "../../configs/APIs";
import { ActivityIndicator, List } from "react-native-paper";
import Style from "./Style";
import TourDetails from "./TourDetails";


const Tour = ({route, navigation}) => {
    const [tours, setTours] = React.useState([]);
    React.useEffect( () => {
        const loadTours = async () => {
            try {
                let res = await APIs.get(endpoints["tours"]);
                setTours(res.data.results);
            } catch (ex) {
                console.error(ex);
            }
        }
        loadTours();
    });

    const goToDetails = (tourId) => {
        navigation.navigate("TourDetails", {"tourId": tourId})
    }
    
    return (
        <View style={{alignItems:"center"}}>
            <Text style={{fontSize:30, fontWeight:"bold"}}>Danh sach tour du lich</Text>
            <ScrollView>
                {tours === null ? <ActivityIndicator /> : <>
                {
                    tours.map(t => (
                        <View key={t.id}>
                            <TouchableOpacity style={Style.row} onPress={() => {goToDetails(t.id)}}>
                                <Image source={{ uri : t.tour_image[0].image}} style={Style.img} />   
                                <View style={{justifyContent:"center"}}>
                                    <Text style={Style.text}>{t.name}</Text>
                                </View>                         
                            </TouchableOpacity>
                        </View>
                    ))
                }
                </>}
            </ScrollView>
        </View>
    )
}


export default Tour;