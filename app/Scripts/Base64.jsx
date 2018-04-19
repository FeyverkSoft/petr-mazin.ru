import React from 'react';
import { Lang } from '../lang.jsx';
import { getObject } from '../Api.jsx';
import { AreaInput, Button, Select, LabeledPre, Toggle, MaterialList, ListItem, Item, Input } from "../Components/InputAndButton.jsx";

export class Base64 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            srcValue: '',
            result: '',
            direction: 'decode',
            rfc_3548_4: false,
            lineMaxWidth: 0
        };
        this.Process = this.Process.bind(this);
        this.onInputVal = this.onInputVal.bind(this);
    }

    Utf8Decode(str) {
        let string = "";
        let i = 0;
        let c = 0, c1 = 0, c2 = 0, c3 = 0;

        while (i < str.length) {
            c = str.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = str.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = str.charCodeAt(i + 1);
                c3 = str.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }

        return string;
    }

    Utf8Encode(str) {
        let string = str;// str.replace(/\r\n/g, "\n");
        let utfText = "";

        for (let n = 0; n < string.length; n++) {

            let c = string.charCodeAt(n);

            if (c < 128) {
                utfText += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utfText += `${String.fromCharCode((c >> 6) | 192)}${String.fromCharCode((c & 63) | 128)}`;
            }
            else {
                utfText += `${String.fromCharCode((c >> 12) | 224)}${String.fromCharCode(((c >> 6) & 63) | 128)}${String.fromCharCode((c & 63) | 128)}`;
            }

        }
        return utfText;
    }

    GetBaseStr(rfc_3548_4) {
        const base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        const base64rfc_3548 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_="
        return rfc_3548_4 ? base64rfc_3548 : base64;
    }

    Encode(input, rfc_3548_4, lineMaxWidth) {
        let output = "";
        let chr1, chr2, chr3, enc1, enc2, enc3, enc4;

        let _keyStr = this.GetBaseStr(rfc_3548_4);

        let utfStr = this.Utf8Encode(input);

        let i = 0;
        while (i < utfStr.length) {
            chr1 = utfStr.charCodeAt(i++);
            chr2 = utfStr.charCodeAt(i++);
            chr3 = utfStr.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2) || !chr2)
                enc3 = enc4 = 64;
            else if (isNaN(chr3) || !chr3)
                enc4 = 64;
            output += `${_keyStr.charAt(enc1)}${_keyStr.charAt(enc2)}${_keyStr.charAt(enc3)}${_keyStr.charAt(enc4)}`;
        }
        if (lineMaxWidth || lineMaxWidth > 0)
            output = output.replace(new RegExp(".{" + lineMaxWidth + "}", "g"), "$&\n");
        return output;
    }

    Decode(input, rfc_3548_4) {
        let _keyStr = this.GetBaseStr(rfc_3548_4);
        let output = "";
        let chr1, chr2, chr3;
        let enc1, enc2, enc3, enc4;
        let i = 0;

        input = input.replace(/[\n\r]/g, "");

        while (i < input.length) {

            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output += String.fromCharCode(chr1);
            if (enc3 != 64) {
                output += String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output += String.fromCharCode(chr3);
            }
        }
        output = this.Utf8Decode(output);

        return output;
    }

    Process() {
        let result;
        let $this = this;
        switch (this.state.direction.toLowerCase()) {
            case "encode":
                let lineMaxWidth;
                if (($this.state.direction == 'decode' || !$this.state.split) && $this.state.lineMaxWidth > 1);
                lineMaxWidth = $this.state.lineMaxWidth;
                result = $this.Encode($this.state.srcValue, $this.state.rfc_3548_4, lineMaxWidth);
                break;
            case "decode":
                result = $this.Decode($this.state.srcValue, $this.state.rfc_3548_4);
                break;
        }
        this.setState({ result: result });
    }

    onInputVal(val, valid, path) {
        this.setState(getObject(this.state, path, val));
    }

    render() {
        let $this = this;
        let split = $this.state.direction == 'decode';
        let split_param = split || !$this.state.split;
        return (
            <div className='calc-wrapper'>
                <div className='col-wrapper'>
                    <div className='col-2'>
                        <AreaInput
                            label={'input_text'}
                            onChange={$this.onInputVal}
                            path='srcValue'
                            value={$this.state.srcValue}
                        />
                    </div>
                    <div className='col-2'>
                        <LabeledPre label={Lang('result')}
                            value={$this.state.result} />
                    </div>
                </div>
                <div className='col-wrapper col-center'>
                    <div className='col element-padding'>
                        <Button
                            onClick={$this.Process}
                            value={Lang('calc')}
                            className='min-screen-100-width' />
                    </div>
                </div>
                <div className='col-wrapper col-center'>
                    <MaterialList
                        title={'settings'}>
                        <ListItem
                            label={'direction_coding'}
                            description={'direction_coding_description'}
                            className='col-1'
                        >
                            <Select
                                items={[new Item('encode', Lang('encode')), new Item('decode', Lang('decode'))]}
                                value={$this.state.direction}
                                onChange={$this.onInputVal}
                                path='direction'
                            />
                        </ListItem>
                        <ListItem
                            label={'RFC 3548/4'}
                            description={'RFC_3548_description'}
                            className='col-1'>
                            <Toggle
                                value={$this.state.rfc_3548_4}
                                onChange={$this.onInputVal}
                                path='rfc_3548_4' />
                        </ListItem>
                        <ListItem
                            label={'split'}
                            description={'split_description'}
                            disabled={split}
                            className='col-1'>
                            <Toggle
                                value={$this.state.split}
                                onChange={$this.onInputVal}
                                disabled={split}
                                path='split' />
                        </ListItem>
                        <ListItem
                            label={'split_MaxWidth'}
                            description={'split_MaxWidth_description'}
                            className='col-1'
                            disabled={split_param}>
                            <Input
                                value={$this.state.lineMaxWidth}
                                onChange={$this.onInputVal}
                                path='lineMaxWidth'
                                disabled={split_param}
                                regEx='\d+'
                                ignoreInvalidValue={true} />
                        </ListItem>
                    </MaterialList>
                </div>
            </div>);
    }
}