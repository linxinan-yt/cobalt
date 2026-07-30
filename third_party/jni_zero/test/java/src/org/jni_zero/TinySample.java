// Copyright 2023 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

package org.jni_zero;

<<<<<<< HEAD
public class TinySample {
    @NativeMethods
=======

public class TinySample {
    @NativeMethods()
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
    interface Natives {
        void foo(Object a, int b);

        boolean bar(int a, Object b);
    }
}
