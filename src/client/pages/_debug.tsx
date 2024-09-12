import React from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { CheckBox } from "../components/ui/CheckBox";

export default (() => {
    return (
        <div>
            <h1 className="_page-header">Debug</h1>
            <h2>ボタン</h2>
            <div className="_hstack">
                <Button>デフォルト</Button>
                <Button variant="primary">プライマリ</Button>
                <Button disabled>無効</Button>
            </div>
            <h2>Input</h2>
            <div>
                <Input placeholder="text" />
                <Input type="number" placeholder="number" />
                <Input type="password" placeholder="password" />
                <Input disabled placeholder="無効" />
            </div>
            <h2>Check</h2>
            <div className="_vstack">
                <CheckBox label="未チェック" />
                <CheckBox defaultChecked label="チェック済み" />
                <CheckBox disabled label="無効" />
                <CheckBox disabled defaultChecked label="無効" />
            </div>
            
        </div>
    );
}) as React.FC;