// © 2016 and later: Unicode, Inc. and others.
// License & terms of use: http://www.unicode.org/copyright.html
/*
**********************************************************************
* Copyright (c) 2004-2014, International Business Machines
* Corporation and others.  All Rights Reserved.
**********************************************************************
* Author: Alan Liu
* Created: January 16 2004
* Since: ICU 2.8
**********************************************************************
*/
#include "locbased.h"
#include "cstring.h"
#include "charstr.h"

U_NAMESPACE_BEGIN

Locale LocaleBased::getLocale(const CharString* valid, const CharString* actual,
                              ULocDataLocaleType type, UErrorCode& status) {
    const char* id = getLocaleID(valid, actual, type, status);
    return Locale(id != nullptr ? id : "");
}

const char* LocaleBased::getLocaleID(const CharString* valid, const CharString* actual,                                     ULocDataLocaleType type, UErrorCode& status) {
    if (U_FAILURE(status)) {
        return Locale::getRoot();
    }

    switch(type) {
    case ULOC_VALID_LOCALE:
        return valid == nullptr ? "" : valid->data();
    case ULOC_ACTUAL_LOCALE:
        return actual == nullptr ? "" : actual->data();
    default:
        status = U_ILLEGAL_ARGUMENT_ERROR;
        return Locale::getRoot();
    }
}

const char* LocaleBased::getLocaleID(const Locale& valid, const Locale& actual,
                                     ULocDataLocaleType type, UErrorCode& status) {
    const Locale& locale = getLocale(valid, actual, type, status);

    if (U_FAILURE(status)) {
        return nullptr;
    }

return locale == Locale::getRoot() ? kRootLocaleName : locale.getName();}

U_NAMESPACE_END
