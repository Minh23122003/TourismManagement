import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, useWindowDimensions } from 'react-native';
import APIs, { endpoints } from '../../configs/APIs';
import Style from './Style';
import { Card } from 'react-native-paper';
import RenderHTML from 'react-native-render-html';
import moment from 'moment';

const TourDetails = ({ route }) => {
    const tourId = route.params?.tourId;
    const [tour, setTour] = React.useState(null);
    const { width } = useWindowDimensions();

    const loadTour = async () => {
        try {
            let res = await APIs.get(endpoints['tour-details'](tourId))
            setTour(res.data)
        } catch (ex) {
            console.error(ex);
        }
    }

    React.useEffect(() => {
        loadTour();
    }, [tourId])

    return (
        <View style={[Style.container, Style.margin]}>
            <ScrollView>
                {tour===null?<ActivityIndicator/>:<>
                    <Card key={tour.id}>
                        <Card.Title titleStyle={Style.nameTour} title={tour.name} />
                        <Card.Content>
                            <RenderHTML contentWidth={width} source={{html: tour.description}} />
                        </Card.Content>
                        <Text style={Style.margin}>Ngay bat dau: {moment(tour.start_date).format('DD-MM-YYYY')}</Text>
                        <Text style={Style.margin}>Ngay ket thuc: {moment(tour.end_date).format('DD-MM-YYYY')}</Text>
                        {tour.tour_image.map(t => <View>
                            <Card.Cover style={Style.margin} key={t.id} source={{uri:t.image}} />
                            <View style={{alignItems:"center"}} >
                                <Text style={{fontStyle:"italic"}}>{t.name}</Text>
                            </View>                       
                        </View> )}
                    </Card>
                </>}
            </ScrollView>
        </View>
    )
}

export default TourDetails