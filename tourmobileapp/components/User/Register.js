import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native"
import * as ImagePicker from 'expo-image-picker'
import APIs, { endpoints } from "../../configs/APIs";
import Style from "./Style";
import { HelperText, TouchableRipple, Button, TextInput } from "react-native-paper";

const Register = () => {
    const [user, setUser] = React.useState({})
    const [err, setErr] = React.useState(false)
    const [contentErr, setContentErr] = React.useState("")
    const fields = [{
        "label": "Tên",
        "icon": "text",
        "field": "first_name"
    }, {
        "label": "Họ và tên lót",
        "icon": "text",
        "field": "last_name"
    // }, {
    //     "label": "Email",
    //     "icon": "email",
    //     "field": "email"
    // }, {
    //     "label": "Số điện thoại",
    //     "icon": "phone",
    //     "field": "phone"
    // }, {
    //     "label": "Địa chỉ",
    //     "icon": "home",
    //     "field": "address"
    }, {
        "label": "Tên đăng nhập",
        "icon": "account",
        "field": "username"
    }, {
        "label": "Mật khẩu",
        "icon": "eye",
        "field": "password",
        "secureTextEntry": true
    }, {
        "label": "Xác nhận mật khẩu",
        "icon": "eye",
        "field": "confirm",
        "secureTextEntry": true
    }]
    const nav = useNavigation();
    const [loading, setLoading] = React.useState(false)

    const picker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted')
            Alert.alert("TourMobileApp", "Permissions Denied!")
        else {
            let res = await ImagePicker.launchImageLibraryAsync()
            if (!res.canceled) {
                change("avatar", res.assets[0])
            }
        }
    }

    const change = (field, value) => {
        setUser(current => {
            return {...current, [field]:value}
        })
    }

    const Register = async () => {
        // if(/\S+@\S+\.\S+/.test(user.email)===false){
        //     setContentErr("Email không hợp lệ. Vui lòng kiểm tra lại!")
        //     setErr(true)
        // } else if (user.phone==="" || user.phone.length!==10 || user.phone[0]!=='0'){
        //     setContentErr("Số điện thoại không đúng hoặc đã được sử dụng. Vui lòng kiểm tra lại!")
        //     setErr(true)
        // } else 
        if(user.password !== user.confirm) {
            setContentErr("Mật khẩu không khớp. Vui lòng kiểm tra lại!")
            setErr(true)
        }
        else {
            setErr(false)
            setLoading(true)
            let uriArray = user.avatar.uri.split(".");
            let fileExtension = uriArray[uriArray.length - 1];  // e.g.: "jpg"
            let fileTypeExtended = `${user.avatar.type}/${fileExtension}`; // e.g.: "image/jpg"
            try {
                let form = new FormData()
                for (let f in user)
                    if(f !== 'confirm')
                        if(f==='avatar')
                            form.append(f, {
                                uri: user.avatar.uri,
                                name: user.avatar.fileName,
                                type: fileTypeExtended
                            })
                        else
                            form.append(f, user[f])
                console.info(form)
                console.info(user.avatar.uri)
                console.info(user.avatar.fileName)
                console.info(user.avatar.type)
                
                
                let res = await APIs.post(endpoints['register'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if(res.status===201)
                    nav.navigate('Login')
            }catch (ex) {
                console.error(ex)
            } finally{
                setLoading(false)
            }
        }
    }


    return (
        <View style={[Style.container, Style.margin]}>
            <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':"height"}>
            <ScrollView>
                <Text style={Style.text}>Đăng ký người dùng</Text>

                {fields.map(f => <TextInput secureTextEntry={f.secureTextEntry} value={user[f.field]} onChangeText={t => change(f.field, t)} style={Style.margin} key={f.field} label={f.label} right={<TextInput.Icon icon={f.icon} />} />)}

                <HelperText style={[Style.margin, {color:"red"}]} type="error" visible={err}>{contentErr}</HelperText>

                <TouchableRipple style={Style.margin} onPress={picker}>
                    <Text>Chọn ảnh đại diện ...</Text>
                </TouchableRipple>

                {user.avatar && <Image source={{uri: user.avatar.uri}} style={Style.avatar} />}
                <Button icon="account" loading={loading} mode="contained" onPress={Register} >Đăng ký</Button>
            </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

export default Register;