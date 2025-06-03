const formatResponse = (req, res, next) => {
    const originalJson = res.json;
    res.json = function (data) {
        const response = {
            success: true,
            data: data || null,
            status: res.statusCode || 200,
            message: "Request Successful",
        };
        originalJson.call(this,response);
    };

    // Override res.status to update status code
    const originalStatus = res.status;
    res.status = function (code){
        res.statusCode = code;
        return this;
    };

    // Error handling
    const originalEnd = res.end;
    res.end = function (chunk, encoding){
        if(res.statusCode >= 400){
            const errorResponse = {
                success: false,
                data: null,
                status: res.statusCode,
                error: {
                    message: chunk?.toString() || "An error Occured",
                },
            };
            originalJson.call(this,errorResponse);
        }else{
            originalEnd.call(this,chunk,encoding);
        }
    };

    next();
};

module.exports = formatResponse;