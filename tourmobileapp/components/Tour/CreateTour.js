import React from "react"
import APIs, { endpoints } from "../../configs/APIs"
import { Button, RadioButton, TextInput, TouchableRipple } from "react-native-paper"
import Style from "./Style"
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native"
import SelectDropdown from "react-native-select-dropdown"
import * as ImagePicker from 'expo-image-picker'

const CreateTour = () => {
    const [name, setName] = React.useState()
    const [description, setDescription] = React.useState()
    const [startDate, setStartDate] = React.useState()
    const [endDate, setEndDate] = React.useState()
    const [priceAdult, setPriceAdult] = React.useState(0)
    const [priceChildren, setPriceChildren] = React.useState(0)
    const [quantity, setQuantity] = React.useState(0)
    const [categories, setCategories] = React.useState([])
    const [cateId, setCateId] = React.useState()
    const [destination, setDestination] = React.useState([{"location":"", "name":""}])
    const [quantityDestination, setQuantityDestination]= React.useState(1)
    const fields = []
    const [image, setImage] = React.useState(null)

    const loadCategories = async ()=> {
        try {
            let res = await APIs.get(endpoints["cateTours"]);
            setCategories(res.data);
        } catch (ex) {
            console.error(ex);
        }
    }

    React.useEffect(()=> {
        loadCategories();
    }, [])

    const picker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted')
            Alert.alert("TourMobileApp", "Permissions Denied!")
        else {
            let res = await ImagePicker.launchImageLibraryAsync()
            if (!res.canceled) {
                setImage(res.assets[0])
            }
        }
    }

    const Create = async () => {
        form = new FormData()
        form.append('image', {
            uri:image.uri,
            name:image.fileName,
            type:image.type
        })
        let res = await APIs.post(endpoints['register'], form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        console.info(form)
        console.info(image.uri)
    }

    return (
        <ScrollView style={Style.container} >
            <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':"height"} >
            <TextInput onChangeText={setName} placeholder="Nhập tên tour" style={[Style.margin, {width:350}]} mode="outlined" />
            <TextInput onChangeText={setDescription} placeholder="Nhập thông tin tour" style={[Style.margin, {width:350}]} mode="outlined" />
            <TextInput onChangeText={setStartDate} placeholder="Nhập ngày đi (dd-mm-yyyy)" style={[Style.margin, {width:350}]} mode="outlined" />
            <TextInput onChangeText={setEndDate} placeholder="Nhập ngày kết thúc (dd-mm-yyyy)" style={[Style.margin, {width:350}]} mode="outlined" />
            <TextInput onChangeText={setPriceAdult} placeholder="Nhập giá vé người lớn" style={[Style.margin, {width:350}]} mode="outlined" keyboardType="numeric" />
            <TextInput onChangeText={setPriceChildren} placeholder="Nhập giá vé trẻ em (nếu có)" style={[Style.margin, {width:350}]} mode="outlined" keyboardType="numeric" />
            <TextInput onChangeText={setQuantity} placeholder="Nhập số lượng vé" style={[Style.margin, {width:350}]} mode="outlined" keyboardType="numeric" />
            <Text>Chọn loại tour</Text>
            <RadioButton.Group onValueChange={value => setCateId(value)} >
                {categories.map(c => <RadioButton.Item key={c.id} status={cateId===c.id?"checked":"unchecked"} label={c.name} value={c.id} />)}
            </RadioButton.Group>
            <View style={[Style.margin, Style.container, Style.row]} >
                <TextInput onChangeText={destination[0].name} placeholder="1" mode="outlined" style={[Style.margin,{width:200}]} />
                <TextInput onChangeText={destination[0].location} placeholder="2" mode="outlined" style={[Style.margin,{width:100}]} />
                <TouchableOpacity style={[{backgroundColor:"lightblue", width:40, marginLeft:10, alignItems:"center", justifyContent:"center"}]} >
                    <Text>+</Text>
                </TouchableOpacity>
            </View>
            <TouchableRipple style={Style.margin} onPress={picker}>
                <Text>Chọn ảnh đại diện ...</Text>
            </TouchableRipple>
            {image && <Image source={{uri: image.uri}} style={Style.avatar} />}
            </KeyboardAvoidingView>
            <TouchableOpacity onPress={() => Create()}>
                <Text>Tao</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default CreateTour