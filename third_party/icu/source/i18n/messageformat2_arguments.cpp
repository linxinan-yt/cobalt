// © 2024 and later: Unicode, Inc. and others.
// License & terms of use: http://www.unicode.org/copyright.html

#include "unicode/utypes.h"

#if !UCONFIG_NO_NORMALIZATION

#if !UCONFIG_NO_FORMATTING

#if !UCONFIG_NO_MF2

#include "unicode/messageformat2.h"
#include "unicode/messageformat2_arguments.h"
#include "unicode/messageformat2_data_model_names.h"
#include "messageformat2_evaluation.h"
<<<<<<< HEAD
#include "messageformat2_function_registry_internal.h"
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
#include "uvector.h" // U_ASSERT

U_NAMESPACE_BEGIN

namespace message2 {

    using namespace data_model;

    // ------------------------------------------------------
    // MessageArguments

    using Arguments = MessageArguments;

<<<<<<< HEAD
    const Formattable* Arguments::getArgument(const VariableName& arg,
=======
    const Formattable* Arguments::getArgument(const MessageFormatter& context,
                                              const VariableName& arg,
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
                                              UErrorCode& errorCode) const {
        if (U_SUCCESS(errorCode)) {
            U_ASSERT(argsLen == 0 || arguments.isValid());
            for (int32_t i = 0; i < argsLen; i++) {
<<<<<<< HEAD
                UnicodeString normalized = StandardFunctions::normalizeNFC(argumentNames[i]);
=======
                UnicodeString normalized = context.normalizeNFC(argumentNames[i]);
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
                // arg already assumed to be normalized
                if (normalized == arg) {
                    return &arguments[i];
                }
            }
            errorCode = U_ILLEGAL_ARGUMENT_ERROR;
        }
        return nullptr;
    }

    MessageArguments::~MessageArguments() {}

    // Message arguments
    // -----------------

    MessageArguments& MessageArguments::operator=(MessageArguments&& other) noexcept {
        U_ASSERT(other.arguments.isValid() || other.argsLen == 0);
        argsLen = other.argsLen;
        if (argsLen != 0) {
            argumentNames.adoptInstead(other.argumentNames.orphan());
            arguments.adoptInstead(other.arguments.orphan());
        }
        return *this;
    }

} // namespace message2

U_NAMESPACE_END

#endif /* #if !UCONFIG_NO_MF2 */

#endif /* #if !UCONFIG_NO_FORMATTING */

#endif /* #if !UCONFIG_NO_NORMALIZATION */
