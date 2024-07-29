import React from "react";
import { Dialog } from 'primereact/dialog';


export default function LogErrors({ visible, setVisible, errorMsg }) {

    return (<>
        <Dialog header="Error" visible={visible} position={'top'} style={{ width: '50vw' }}
            onHide={() => { if (!visible) return; setVisible(false); }} draggable={false} resizable={false}>
            <p className="m-0">{errorMsg}</p>
        </Dialog>
    </>)
}