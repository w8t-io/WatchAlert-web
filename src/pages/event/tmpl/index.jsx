import ContentLayout from "components/ContentLayout";
import {ContentNormalHeader} from "components/ContentNormalHeader";
import React from "react";

export const EventTmpl = (props) => {

    return (
        <>
            <ContentLayout
                navComponent={<ContentNormalHeader title="告警事件" />}
                children={
                    <div className="application_list_comp">
                        {props.children}
                    </div>
                }
            />
        </>
    );
};
