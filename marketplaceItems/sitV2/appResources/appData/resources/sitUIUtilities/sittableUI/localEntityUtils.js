function getEntityPropertiesForImageInFrontOfCamera(positionInFront, dimensions, url) {
    return {
        type: "Image",
        grab: { grabbable: false },
        dynamic: false,
        parentJointIndex: MyAvatar.getJointIndex("_CAMERA_MATRIX"),
        imageURL: url,
        position: Vec3.sum(Camera.position, Vec3.multiplyQbyV(Camera.orientation, positionInFront)),
        dimensions: dimensions,
        rotation: Camera.rotation,
        parentID: MyAvatar.sessionUUID,
        ignoreRayIntersection: false,
        drawInFront: true,
        visible: true,
        emissive: true
    }
}

module.exports = {
    getEntityPropertiesForImageInFrontOfCamera: getEntityPropertiesForImageInFrontOfCamera
}