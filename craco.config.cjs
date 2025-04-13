module.exports = {
    webpack: {
        configure: (webpackConfig, { env }) => {
            if (env === 'development') {
                // Loại bỏ plugin ErrorOverlayPlugin
                webpackConfig.plugins = webpackConfig.plugins.filter(
                    (plugin) => plugin.constructor.name !== 'ErrorOverlayPlugin'
                );
            }
            return webpackConfig;
        },
    },
    devServer: (devServerConfig, { env }) => {
        if (env === 'development') {
            // Tắt overlay lỗi trong trình duyệt
            devServerConfig.client = {
                ...devServerConfig.client,
                overlay: false,
            };
        }
        return devServerConfig;
    },
};