import React, { useEffect, useState } from 'react';

import { service } from '../../service'

function index(props) {
    const themes = props.themes
    const [feature_id, setFeatureId] = useState(props.feature_id)
    const [feature_ids, setFeatureIds] = useState([])

    useEffect(() => {
        if (props.feature_id && feature_id !== props.feature_id) {
            getOverlapsFeatures(props.feature_id)
        }
    }, [props.feature_id])

    const getOverlapsFeatures = (feature_id) => {
        service
            .getOverlapsFeature(feature_id)
            .then(({ success, feature_ids }) => {
                if(success) {
                    setFeatureIds(feature_ids)
                    setFeatureId(feature_id)
                }
            })
    }

    const setOverlapsFeatures = (feature_id, overlap_feature_id, state) => {
        service
            .setOverlapsFeature(feature_id, overlap_feature_id, state)
            .then(({ success, info }) => {
                if(success) {
                    global.NOTIF('success', info, 'times')
                    getOverlapsFeatures(feature_id)
                }
                else{
                    global.NOTIF('danger', info, 'check')
                }
            })
    }

    return (
        <div>
            <div className="row border ml-1 mr-0 mb-5">
                <div className="col-12">
                    <h4 className="text-center">Үл давхцах давхаргууд</h4>
                    <hr />
                </div>
                <div className="col-md-6 height-feature-select card-body">
                    {
                        themes.map((theme, idx) =>
                            theme.package.map((packages, idx) =>
                                packages.features.map((feature, idx) =>
                                    feature_ids.indexOf(feature.id) < 0 && feature_id != feature.id
                                    &&
                                        <div
                                            key={idx}
                                            className="row list-card"
                                            onClick={() => setOverlapsFeatures(feature_id , feature.id, "create")}
                                        >
                                            <div className="col-10">
                                                <a>
                                                    <i className="fa fa-table"></i> &nbsp;
                                                    <span role="button" className="hidden-xs gp-text-primary"> {feature.name}</span>
                                                </a>
                                            </div>
                                            <div className="col-2">
                                                <a type="button" className="gp-text-primary">
                                                    <i className="fa fa-plus-circle gp-text-primary fa-2x"></i>
                                                </a>
                                            </div>
                                        </div>
                                )
                            )
                        )
                    }
                </div>
                <div className="col-md-6 height-feature-select card-body">
                    {
                        themes.map((theme, idx) =>
                            theme.package.map((packages, idx) =>
                                packages.features.map((feature, idx) => (
                                    feature_ids.indexOf(feature.id) > -1 && feature_id != feature.id
                                    &&
                                        <div
                                            key={idx}
                                            className="row list-card"
                                            onClick={() => setOverlapsFeatures(feature_id , feature.id, "remove")}
                                        >
                                            <div className="col-11">
                                                <a>
                                                    <i className="fa fa-table"></i> &nbsp;
                                                    <span role="button" className="hidden-xs gp-text-primary"> {feature.name}</span>
                                                </a>
                                            </div>
                                            <div className="col-1">
                                                <a type="button" className="gp-text-primary" >
                                                    <i className="fa fa-minus gp-text-primary fa-2x"></i>
                                                </a>
                                            </div>
                                        </div>
                                ))
                            )
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default index;
