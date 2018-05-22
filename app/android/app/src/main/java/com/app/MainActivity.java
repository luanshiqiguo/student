package com.app;

import android.os.Bundle;
import com.cboy.rn.splashscreen.SplashScreen;

import com.facebook.react.ReactActivity;
import com.oblador.vectoricons.VectorIconsPackage;
import cn.reactnative.modules.update.UpdatePackage;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "app";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this,true);
        super.onCreate(savedInstanceState);
    }
}
