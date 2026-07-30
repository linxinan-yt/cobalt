# JNI Zero Refactoring Examples

## 1. Instance Methods

**Before:**

```cpp
void TokenAndroid::FromJavaToken(JNIEnv* env, const JavaRef<jobject>& j_token) {
  uint64_t high = Java_TokenBase_getHighForSerialization(env, j_token);
}
```

**After:**

```cpp
// In .h
static base::Token FromJavaToken(JNIEnv* env, const JavaRef<JTokenBase>& j_token);

// In .cc
...
base::Token TokenAndroid::FromJavaToken(JNIEnv* env, const JavaRef<JTokenBase>& j_token) {
  uint64_t high = static_cast<uint64_t>(j_token->getHighForSerialization(env));
}
```

## 2. Static Methods

**Before:**

```cpp
void ApplicationStatusListener::NotifyApplicationStateChange(ApplicationState state) {
  Java_ApplicationStatus_registerThreadSafeNativeApplicationStateListener(AttachCurrentThread());
}
```

**After:**

```cpp
// In .cc
...
void ApplicationStatusListener::NotifyApplicationStateChange(ApplicationState state) {
  JApplicationStatusClass::registerThreadSafeNativeApplicationStateListener(AttachCurrentThread());
}
```

## 3. System Classes (e.g., ParcelFileDescriptor)

**Before:**

```cpp
int ContentUriGetFd(const JavaRef<jobject>& java_parcel_file_descriptor) {
  int fd = Java_ContentUriUtils_getFd(env, java_parcel_file_descriptor);
}
```

**After:**

```cpp
// In .cc
...
int ContentUriGetFd(const JavaRef<jobject>& java_parcel_file_descriptor) {
  int fd = JContentUriUtilsClass::getFd(env, java_parcel_file_descriptor);
}
```

## 4. Converting ScopedJavaLocalRef<jobject>()

**Before:**

```cpp
return ScopedJavaLocalRef<jobject>();
```

**After:**

```cpp
return nullptr;
```

<<<<<<< HEAD
## 5. Arrays

### Creating Object Arrays
=======
## 5. Replacing Unsafe Manual JNI Get method call with Safe Helpers
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)

**Before:**

```cpp
<<<<<<< HEAD
jobjectArray j_strs = env->NewObjectArray(size, string_clazz, nullptr);
```

**After:**

```cpp
ScopedJavaLocalRef<JArray<jstring>> strs = NewStringArray(env, size);
```

### Accessing Elements

**Before:**

```cpp
jobject j_obj = env->GetObjectArrayElement(j_array, index);
ScopedJavaLocalRef<MyClass> obj = AdoptRef(env, static_cast<MyClass>(j_obj));

jstring j_str = static_cast<jstring>(env->GetObjectArrayElement(j_strs, index));
std::string str = ConvertJavaStringToUTF8(env, j_str);
```

**After:**

```cpp
ScopedJavaLocalRef<JMyClass> obj = array.Get(env, index);

std::string str = strs.GetAs<std::string>(env, index);
```

### Setting Elements

**Before:**

```cpp
env->SetObjectArrayElement(j_array, index, value.obj());
```

**After:**

```cpp
array.Set(env, index, value);
```

### Iterating Arrays

**Before:**

```cpp
jsize length = env->GetArrayLength(j_array);
for (jsize i = 0; i < length; ++i) {
  ScopedJavaLocalRef<jstring> j_str = AdoptRef(env, static_cast<jstring>(env->GetObjectArrayElement(j_array, i)));
  std::string str = ConvertJavaStringToUTF8(env, j_str);
  // ...
=======
const void* MediaDrmBridge::GetMetrics(int* size) {
  JNIEnv* env = AttachCurrentThread();
  ScopedJavaLocalRef<jbyteArray> j_metrics = Java_MediaDrmBridge_getMetrics(env, j_media_drm_bridge_);
  
  // Unsafe: Manual pointer retrieval
  jbyte* metrics_elements = env->GetByteArrayElements(j_metrics.obj(), nullptr);
  jsize metrics_size = base::android::SafeGetArrayLength(env, j_metrics);
  SB_DCHECK(metrics_elements);

  metrics_.assign(metrics_elements, metrics_elements + metrics_size);

  // Unsafe: Must remember to release, otherwise it leaks!
  env->ReleaseByteArrayElements(j_metrics.obj(), metrics_elements, JNI_ABORT);
  
  *size = static_cast<int>(metrics_.size());
  return metrics_.data();
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
}
```

**After:**

```cpp
<<<<<<< HEAD
for (auto str : strs.CreateView(env)) {
  std::string s = str.ConvertTo<std::string>(env);
  // ...
}
```

### Primitive Arrays
=======
const void* MediaDrmBridge::GetMetrics(int* size) {
  JNIEnv* env = AttachCurrentThread();
  ScopedJavaLocalRef<jbyteArray> j_metrics = Java_MediaDrmBridge_getMetrics(env, j_media_drm_bridge_);
  
  // Safe: Automatically handles lifetime, copying, and release
  base::android::JavaByteArrayToByteVector(env, j_metrics, &metrics_);
  
  *size = static_cast<int>(metrics_.size());
  return metrics_.data();
}
```

## 6. Replacing Unsafe Manual JNI Creation (New*) with Safe Helpers
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)

**Before:**

```cpp
<<<<<<< HEAD
jbyteArray j_array = ...;
jbyte* bytes = env->GetByteArrayElements(j_array, nullptr);
jsize length = env->GetArrayLength(j_array);
std::string_view sv(reinterpret_cast<char*>(bytes), length);
// ...
env->ReleaseByteArrayElements(j_array, bytes, JNI_ABORT);
=======
ScopedJavaLocalRef<jbyteArray> ToScopedJavaByteArray(JNIEnv* env, std::string_view data) {
  // Unsafe: Raw NewByteArray call returns a raw local ref that can leak
  jbyteArray j_array = env->NewByteArray(data.size());
  if (!j_array) {
    return nullptr;
  }
  
  // Unsafe: Raw SetByteArrayRegion call
  env->SetByteArrayRegion(j_array, 0, data.size(), reinterpret_cast<const jbyte*>(data.data()));
  
  // Must remember to wrap it before returning, but any early return above would have leaked j_array!
  return ScopedJavaLocalRef<jbyteArray>(env, j_array);
}
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
```

**After:**

```cpp
<<<<<<< HEAD
ScopedJavaLocalRef<JArray<int8_t>> array = ...;
JArrayView<int8_t> array_view = array.CreateView(env);
std::string_view sv = array_view.as_string_view();
```

*(Note: `JArrayView` automatically releases the elements when it goes out of
scope.)*
=======
ScopedJavaLocalRef<jbyteArray> ToScopedJavaByteArray(JNIEnv* env, std::string_view data) {
  // Safe: ToJavaByteArray handles NewByteArray, SetByteArrayRegion, and ScopedJavaLocalRef wrapping in one shot
  return base::android::ToJavaByteArray(env, data);
}
```
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
